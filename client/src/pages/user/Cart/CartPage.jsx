import React, { useState } from 'react';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, AlertTriangle, X, QrCode, CheckCircle, CreditCard, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  
  // State quản lý Modal xóa và Modal Thanh toán
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // --- LOGIC TÍNH PHÍ VẬN CHUYỂN & TỔNG THANH TOÁN ---

  // 1. Tổng tiền hàng (chưa bao gồm phí ship)
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 2. Tính phí vận chuyển (Shipping Fee) theo 3 mức
  // Dưới 2tr: 100k, Từ 2tr đến dưới 4tr: 50k, Từ 4tr trở lên: Miễn phí
  const shippingFee = totalPrice < 2000000 
    ? 100000 
    : (totalPrice < 4000000 ? 50000 : 0);

  // 3. Tổng thanh toán cuối cùng (Phải trả)
  const finalTotal = totalPrice + shippingFee;

  // --- CẤU HÌNH NGÂN HÀNG MB BANK ---
  const BANK_ID = "MB";
  const ACCOUNT_NO = "50570222";
  const ACCOUNT_NAME = "BAO LINH TECH"; // Tên không dấu
  const description = `Thanh toan BLT${Math.floor(Math.random() * 9000) + 1000}`; // Nội dung chuyển khoản

  // Link VietQR API - LƯU Ý: ĐÃ SỬ DỤNG finalTotal ĐỂ TẠO MÃ QR CHÍNH XÁC
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact.png?amount=${finalTotal}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const openDeleteModal = (item) => {
    setProductToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      removeFromCart(productToDelete._id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // --- HÀM XỬ LÝ KHI NHẤN XÁC NHẬN THANH TOÁN ---
  const handleConfirmPayment = () => {
    // Giả lập kiểm tra trạng thái thanh toán (Trong thực tế bạn sẽ gọi API kiểm tra)
    const isSuccess = true; // Bạn có thể đổi thành false để thử trường hợp thất bại

    if (isSuccess) {
      // 1. Thông báo thành công
      toast.success("Thanh toán thành công! ");
      
      // 2. Xóa sạch giỏ hàng
      clearCart(); 
      
      // 3. Đóng Modal
      setIsCheckoutModalOpen(false);
    } else {
      // 4. Thông báo thất bại
      toast.error("Thanh toán thất bại! Vui lòng thử lại.");
    }
  };
  if (cartItems.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-white px-4 text-center">
        <div className="bg-slate-50 p-8 rounded-[3rem] text-slate-300">
           <ShoppingBag size={80} strokeWidth={1} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 italic">Giỏ hàng đang trống</h2>
        <p className="text-slate-500 font-medium">Hãy chọn cho mình những sản phẩm chất lượng nhất nhé!</p>
        <Link 
          to="/" 
          className="mt-4 px-8 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-orange-100 flex items-center gap-2 uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={18} /> Quay lại mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 1. DANH SÁCH SẢN PHẨM */}
          <div className="lg:w-2/3 space-y-6">
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
               <h1 className="text-3xl font-black text-slate-900">Giỏ hàng <span className="text-orange-600">({cartItems.length})</span></h1>
               <Link to="/" className="text-sm font-bold text-orange-600 hover:text-slate-900 transition-colors flex items-center gap-1">
                 <Plus size={16} /> Tiếp tục mua sắm
               </Link>
            </div>

            {cartItems.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-white hover:border-orange-100 transition-all flex flex-col md:flex-row items-center gap-6 group">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl overflow-hidden p-2 flex-shrink-0 flex items-center justify-center">
                  <img src={item.images && item.images.length > 0 ? item.images[0].url : 'https://via.placeholder.com/300'} alt={item.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">{item.name}</h3>
                  <p className="text-orange-600 font-black text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                  </p>
                </div>

                <div className="flex flex-col md:items-end gap-4 w-full md:w-auto items-center">
                  <button onClick={() => openDeleteModal(item)} className="p-2 text-slate-300 hover:text-red-500 transition-colors md:self-end self-center">
                    <Trash2 size={20} />
                  </button>
                  
                  <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100 shadow-inner">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-400 disabled:opacity-40"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center font-black text-slate-900 text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-400"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 2. TỔNG KẾT ĐƠN HÀNG (STICKY) */}
          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 sticky top-32 border border-white">
              <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                 <Banknote size={24} className="text-orange-600" />
                 Tóm tắt đơn hàng
              </h2>
              
              <div className="space-y-4 mb-8">
                {/* Tạm tính */}
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Giá trị hàng hóa</span>
                  <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</span>
                </div>
                
                {/* Phí vận chuyển: Hiển thị Miễn phí hoặc Số tiền cụ thể */}
                <div className="flex justify-between text-slate-500 font-medium pb-4 border-b border-slate-50">
                  <span>Phí vận chuyển</span>
                  <span className={shippingFee === 0 ? "text-green-500 font-black uppercase text-sm tracking-widest" : "font-black"}>
                    {shippingFee === 0 
                      ? "Miễn phí" 
                      : `${new Intl.NumberFormat('vi-VN').format(shippingFee)}đ`}
                  </span>
                </div>

                {/* Tổng cộng cuối cùng (Gạch chân) */}
                <div className="pt-2 flex justify-between items-baseline">
                  <span className="text-lg font-bold text-slate-900">Tổng thanh toán</span>
                  <span className="text-3xl font-black text-orange-600 tracking-tight">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Nút thanh toán */}
              <button 
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full py-5 bg-orange-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 uppercase text-sm tracking-widest"
              >
                <CreditCard size={20} />
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL XÁC NHẬN XÓA --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white p-8 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-fadeInUp">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Xác nhận xóa?</h3>
            <p className="text-slate-500 leading-relaxed mb-8">
              Bạn có chắc chắn muốn xóa <span className="font-bold text-slate-800 italic">"{productToDelete?.name}"</span> khỏi giỏ hàng?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Hủy</button>
              <button onClick={confirmDelete} className="py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-100 transition-all">Đồng ý</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL THANH TOÁN QR (ĐÃ THU NHỎ GỌN GÀNG) --- */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCheckoutModalOpen(false)}></div>
          
          {/* SỬA ĐỔI CHÍNH:max-w-sm (400px), rounded-3xl (tiết kiệm góc), m-auto (giữ giữa) */}
          <div className="relative bg-white w-full max-w-sm m-auto rounded-[2rem] overflow-hidden shadow-2xl animate-fadeInUp">
            <div className="p-6 text-center"> {/* Giảm p-8 xuống p-6 */}
              
              {/* Nút đóng */}
              <button 
                onClick={() => setIsCheckoutModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>

              {/* Icon tiêu đề */}
              <div className="mb-4 inline-flex p-3 bg-orange-50 rounded-2xl text-orange-600">
                <QrCode size={28} />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-1">Quét mã <span className="text-orange-600">Thanh toán</span></h3>
              <p className="text-slate-500 text-xs mb-4 font-bold uppercase tracking-widest italic opacity-70">Hệ thống VietQR - MB Bank</p>

              {/* QR IMAGE: ĐÃ GIỚI HẠNmax-w-[200px] để thu nhỏ tối đa */}
              <div className="bg-slate-50 p-3 rounded-[1.5rem] border border-slate-100 mb-4 shadow-inner max-w-[200px] mx-auto flex items-center justify-center">
                <img 
                  src={qrUrl} 
                  alt="QR Code Payment" 
                  className="w-full aspect-square object-contain mix-blend-multiply rounded-xl"
                />
              </div>

              {/* PAYMENT INFO: ĐÃ GIẢM KHOẢNG CÁCH DÒNG (space-y-1.5) */}
              <div className="space-y-1.5 text-left bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-sm">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-100 mb-1.5">
                  <span className="text-slate-400 font-bold">Chủ tài khoản:</span>
                  <span className="text-slate-900 font-black uppercase text-xs tracking-tighter">{ACCOUNT_NAME}</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-100 mb-1.5">
                  <span className="text-slate-400 font-bold">Số tiền:</span>
                  <span className="text-orange-600 font-black text-xl tracking-tight">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 font-bold flex-shrink-0">Nội dung:</span>
                  <span className="text-slate-900 font-black italic text-right break-words line-clamp-1">{description}</span>
                </div>
              </div>

              {/* Nút xác nhận */}
              <button 
                onClick={handleConfirmPayment}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
              >
                <CheckCircle size={18} />
                Tôi đã chuyển khoản xong
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CartPage;