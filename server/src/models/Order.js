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
        ref: 'Product'
      },
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  // Thông tin giao hàng (Lấy từ Form ở Frontend)
  shippingInfo: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String }
  },
  // Thông tin thanh toán & Giá tiền
  totalAmount: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  orderCode: { type: String, required: true, unique: true }, // Mã BLT12345
  paymentMethod: { type: String, default: 'VietQR' },
  
  // Trạng thái đơn hàng
  status: {
    type: String,
    enum: ['Chờ xác nhận', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'],
    default: 'Chờ xác nhận'
  },
  paidAt: { type: Date },
}, { timestamps: true }); // Tự động tạo createdAt và updatedAt

export default mongoose.model('Order', orderSchema);