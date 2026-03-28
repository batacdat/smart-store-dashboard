import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    const {
      products,
      totalAmount,
      shippingFee,
      shippingInfo,
      orderCode,
      paymentMethod = 'VietQR'
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có sản phẩm trong đơn hàng"
      });
    }

    if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      return res.status(400).json({
        success: false,
        message: "Thông tin giao hàng không đầy đủ"
      });
    }

    // Tạo đơn hàng mới trong Database
    const newOrder = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
      shippingFee: shippingFee || 0,
      shippingInfo,
      orderCode,
      paymentMethod
    });

    // Populate thông tin để gửi qua socket
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('user', 'name phone email')
      .populate('products.product', 'name images price');

    // --- SOCKET.IO: Thông báo cho Admin về đơn hàng mới ---
    if (req.io) {
      try {
        req.io.emit('new-order-admin', {
          success: true,
          message: "Bạn có một đơn hàng mới cần xử lý",
          orderId: newOrder._id,
          orderCode: newOrder.orderCode,
          customer: shippingInfo.fullName,
          customerPhone: shippingInfo.phone,
          totalAmount: newOrder.totalAmount,
          createdAt: newOrder.createdAt,
          order: populatedOrder
        });
        console.log(`📨 Đã gửi thông báo socket cho đơn hàng mới: ${newOrder.orderCode}`);
      } catch (socketError) {
        console.error('Lỗi khi gửi socket notification:', socketError);
      }
    }

    res.status(201).json({
      success: true,
      message: "Đơn hàng đã được tạo thành công",
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đơn hàng",
      error: error.message
    });
  }
};
// Lấy tất cả đơn hàng (Dành cho Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name phone email')
      .populate('products.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách đơn hàng",
      error: error.message
    });
  }
};

// Lấy chi tiết 1 đơn hàng cụ thể
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name phone email')
      .populate('products.product', 'name images price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng này"
      });
    }

    // Kiểm tra quyền: chỉ user sở hữu đơn hàng hoặc admin mới được xem
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem đơn hàng này"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error getting single order:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin đơn hàng",
      error: error.message
    });
  }
};

// Lấy đơn hàng của người dùng hiện tại
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product', 'name images price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error getting my orders:', error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách đơn hàng của bạn",
      error: error.message
    });
  }
};

// Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const oldStatus = (await Order.findById(req.params.id))?.status;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    // --- LOGIC TRỪ/HOÀN KHO TỰ ĐỘNG ---
    
    // TRƯỜNG HỢP 1: Xác nhận đơn (Chờ xác nhận -> Đang xử lý) => TRỪ KHO
    if (status === 'Đang xử lý' && order.status === 'Chờ xác nhận') {
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        
        if (!product) {
          return res.status(404).json({ 
            success: false, 
            message: `Sản phẩm ${item.name} không còn tồn tại trong hệ thống` 
          });
        }

        // Kiểm tra xem kho còn đủ hàng không
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            success: false, 
            message: `Sản phẩm "${item.name}" không đủ hàng (Trong kho còn: ${product.stock})` 
          });
        }
        
        // Thực hiện trừ kho
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // TRƯỜNG HỢP 2: Hủy đơn hàng => HOÀN KHO
    // Chỉ hoàn kho nếu đơn hàng đó ĐÃ từng được trừ kho (tức là trạng thái trước đó là Đang xử lý hoặc Đang giao)
    if (status === 'Đã hủy' && (order.status === 'Đang xử lý' || order.status === 'Đang giao')) {
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }
    // ----------------------------------

    // Cập nhật trạng thái mới cho đơn hàng
    order.status = status;
    await order.save();

    // Quan trọng: Populate lại thông tin sản phẩm để tránh lỗi trắng trang ở Frontend
    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name phone email')
      .populate('products.product', 'name images price');

    // --- SOCKET.IO: Thông báo cập nhật trạng thái đơn hàng ---
    if (req.io) {
      try {
        // Gửi thông báo đến admin
        req.io.emit('order-status-updated', {
          success: true,
          message: `Đơn hàng ${order.orderCode} đã được cập nhật trạng thái: ${status}`,
          orderId: order._id,
          orderCode: order.orderCode,
          oldStatus: oldStatus,
          newStatus: status,
          updatedAt: new Date(),
          order: updatedOrder
        });

        // Gửi thông báo riêng đến user sở hữu đơn hàng (nếu user đang online)
        if (order.user && global.onlineUsers?.has(order.user.toString())) {
          const userSocketId = global.onlineUsers.get(order.user.toString());
          req.io.to(userSocketId).emit('my-order-status-updated', {
            success: true,
            message: `Đơn hàng ${order.orderCode} của bạn đã được cập nhật trạng thái: ${status}`,
            orderId: order._id,
            orderCode: order.orderCode,
            oldStatus: oldStatus,
            newStatus: status,
            updatedAt: new Date(),
            order: updatedOrder
          });
        }

        console.log(`📨 Đã gửi thông báo socket cập nhật trạng thái đơn hàng: ${order.orderCode} -> ${status}`);
      } catch (socketError) {
        console.error('Lỗi khi gửi socket notification:', socketError);
      }
    }

    res.status(200).json({
      success: true,
      message: `Đã cập nhật trạng thái: ${status}`,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi cập nhật trạng thái",
      error: error.message
    });
  }
};

// Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentInfo } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng"
      });
    }

    const oldPaymentStatus = order.paymentStatus;
    order.paymentStatus = paymentStatus;
    
    if (paymentStatus === 'Đã thanh toán' && paymentInfo) {
      order.paymentInfo = {
        ...paymentInfo,
        paidAt: Date.now()
      };
    }

    await order.save();

    // Populate lại thông tin để gửi qua socket
    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name phone email')
      .populate('products.product', 'name images price');

    // --- SOCKET.IO: Thông báo cập nhật trạng thái thanh toán ---
    if (req.io) {
      try {
        // Gửi thông báo đến admin
        req.io.emit('payment-status-updated', {
          success: true,
          message: `Đơn hàng ${order.orderCode} đã được cập nhật trạng thái thanh toán: ${paymentStatus}`,
          orderId: order._id,
          orderCode: order.orderCode,
          oldPaymentStatus: oldPaymentStatus,
          newPaymentStatus: paymentStatus,
          paymentInfo: order.paymentInfo,
          updatedAt: new Date(),
          order: updatedOrder
        });

        // Gửi thông báo riêng đến user sở hữu đơn hàng (nếu user đang online)
        if (order.user && global.onlineUsers?.has(order.user.toString())) {
          const userSocketId = global.onlineUsers.get(order.user.toString());
          req.io.to(userSocketId).emit('my-payment-status-updated', {
            success: true,
            message: `Đơn hàng ${order.orderCode} của bạn đã được cập nhật trạng thái thanh toán: ${paymentStatus}`,
            orderId: order._id,
            orderCode: order.orderCode,
            oldPaymentStatus: oldPaymentStatus,
            newPaymentStatus: paymentStatus,
            updatedAt: new Date(),
            order: updatedOrder
          });
        }

        console.log(`📨 Đã gửi thông báo socket cập nhật thanh toán: ${order.orderCode} -> ${paymentStatus}`);
      } catch (socketError) {
        console.error('Lỗi khi gửi socket notification:', socketError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thanh toán thành công",
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái thanh toán",
      error: error.message
    });
  }
};

// Hủy đơn hàng (Người dùng)
// Hủy đơn hàng (Người dùng)
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng"
      });
    }

    // Kiểm tra quyền: chỉ user sở hữu đơn hàng mới được hủy
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền hủy đơn hàng này"
      });
    }

    // Kiểm tra trạng thái: chỉ hủy khi đơn hàng đang ở trạng thái chờ xác nhận hoặc đang xử lý
    if (order.status !== 'Chờ xác nhận' && order.status !== 'Đang xử lý') {
      return res.status(400).json({
        success: false,
        message: `Không thể hủy đơn hàng ở trạng thái ${order.status}`
      });
    }

    const oldStatus = order.status;
    order.status = 'Đã hủy';
    order.cancelledAt = Date.now();
    order.cancelledReason = reason || 'Khách hàng hủy đơn';

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name phone email')
      .populate('products.product', 'name images price');

    // --- SOCKET.IO: Thông báo khi user hủy đơn ---
    if (req.io) {
      try {
        req.io.emit('order-cancelled-by-user', {
          success: true,
          message: `Đơn hàng ${order.orderCode} đã được khách hàng hủy`,
          orderId: order._id,
          orderCode: order.orderCode,
          cancelledReason: order.cancelledReason,
          cancelledAt: order.cancelledAt,
          oldStatus: oldStatus,
          newStatus: 'Đã hủy',
          order: updatedOrder
        });

        console.log(`📨 Đã gửi thông báo socket: Khách hàng hủy đơn ${order.orderCode}`);
      } catch (socketError) {
        console.error('Lỗi khi gửi socket notification:', socketError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Đơn hàng đã được hủy thành công",
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi hủy đơn hàng",
      error: error.message
    });
  }
};

// Thống kê đơn hàng (Admin)
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Chờ xác nhận' });
    const processingOrders = await Order.countDocuments({ status: 'Đang xử lý' });
    const shippingOrders = await Order.countDocuments({ status: 'Đang giao' });
    const deliveredOrders = await Order.countDocuments({ status: 'Đã giao' });
    const cancelledOrders = await Order.countDocuments({ status: 'Đã hủy' });

    const totalRevenue = await Order.aggregate([
      { $match: {  paymentStatus: 'Đã thanh toán' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error getting order stats:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thống kê đơn hàng",
      error: error.message
    });
  }
};