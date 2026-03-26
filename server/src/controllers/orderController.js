import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { 
      userId, 
      products, 
      totalAmount, 
      shippingFee, 
      shippingInfo, 
      orderCode 
    } = req.body;

    // Tạo đơn hàng mới trong Database
    const newOrder = await Order.create({
      user: userId,
      products,
      totalAmount,
      shippingFee,
      shippingInfo,
      orderCode
    });

    res.status(201).json({
      success: true,
      message: "Đơn hàng đã được tạo thành công",
      order: newOrder
    });
  } catch (error) {
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
    // .populate('user', 'name phone email') giúp lấy thông tin chi tiết của user 
    // .sort({ createdAt: -1 }) để đơn hàng mới nhất hiện lên đầu
    const orders = await Order.find()
      .populate('user', 'name phone email') 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
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
    const order = await Order.findById(req.params.id).populate('user', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng này"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};