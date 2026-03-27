import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Liên kết với bảng User để biết ai đặt
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Danh sách sản phẩm trong đơn
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],
  // Thông tin giao hàng (Lấy từ Form ở Frontend)
  shippingInfo: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    note: {
      type: String
    }
  },
  // Thông tin thanh toán & Giá tiền
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingFee: {
    type: Number,
    default: 0,
    min: 0
  },
  orderCode: {
    type: String,
    required: true,
    unique: true
  },
  paymentMethod: {
    type: String,
    default: 'VietQR'
  },
  paymentStatus: {
    type: String,
    enum: ['Chưa thanh toán', 'Đã thanh toán', 'Thanh toán thất bại', 'Hoàn tiền'],
    default: 'Chưa thanh toán'
  },
  paymentInfo: {
    transactionId: String,
    paymentMethod: String,
    paidAt: Date
  },
  // Trạng thái đơn hàng
  status: {
    type: String,
    enum: ['Chờ xác nhận', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Đã hủy', 'Hoàn trả'],
    default: 'Chờ xác nhận'
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelledReason: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);