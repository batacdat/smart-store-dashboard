import React, { useState, useEffect } from 'react';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, AlertTriangle, X, QrCode, CheckCircle, CreditCard, Banknote, Home } from 'lucide-react';
// 1. Import useNavigate từ react-router-dom
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

// 2. Import Header và Footer (HÃY SỬA ĐƯỜNG DẪN NÀY CHO ĐÚNG)
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';

const CartPage = () => {
  const navigate = useNavigate(); // Hook để điều hướng
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  
  // State quản lý Modal và Chuyển bước
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Info Form, 2: QR Code
  const [productToDelete, setProductToDelete] = useState(null);

  // State thông tin giao hàng
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  // Tự động điền thông tin từ tài khoản đã đăng nhập
  useEffect(() => {
    if (isCheckoutModalOpen) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setShippingInfo(prev => ({
          ...prev,
          fullName: user.name || '',
          phone: user.phone || ''
        }));
      }
    }
  }, [isCheckoutModalOpen]);

  // --- LOGIC TÍNH TOÁN ---
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = totalPrice < 2000000 ? 100000 : (totalPrice < 4000000 ? 50000 : 0);
  const finalTotal = totalPrice + shippingFee;

  // --- CẤU HÌNH NGÂN HÀNG ---
  const BANK_ID = "MB";
  const ACCOUNT_NO = "50570222";
  const ACCOUNT_NAME = "BAO LINH TECH";
  const description = `BLT${Math.floor(Math.random() * 90000) + 10000}`;
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact.png?amount=${finalTotal}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = () => {
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      toast.error("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }
    setCheckoutStep(2);
  };

  const handleConfirmPayment = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      
      const orderData = {
        user: savedUser._id,
        products: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: finalTotal,
        shippingFee: shippingFee,
        shippingInfo: shippingInfo, // Dữ liệu từ form
        orderCode: description,
        paymentMethod: 'VietQR'
      };

      // Gọi API Backend của bạn tại đây
      // const res = await axios.post('/api/orders', orderData);

      toast.success("Đặt hàng thành công!");
      clearCart();
      setIsCheckoutModalOpen(false);
      setCheckoutStep(1);
      navigate('/');
    } catch (error) {
      toast.error("Lỗi đặt hàng, vui lòng thử lại!");
    }
  };

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

  // --- JSX CHO TRƯỜNG HỢP GIỎ HÀNG TRỐNG ---
  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50 px-4 text-center pt-32 pb-20">
          <div className="bg-white p-10 rounded-[3rem] text-slate-300 shadow-sm">
             <ShoppingBag size={100} strokeWidth={1} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 italic">Giỏ hàng đang trống</h2>
          <p className="text-slate-500 max-w-sm">Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá ngay các sản phẩm chất lượng của Bảo Linh Tech nhé!</p>
          <Link to="/" className="mt-6 px-10 py-5 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-100 flex items-center gap-2 uppercase text-sm tracking-widest hover:bg-slate-900 transition-all">
            <ShoppingBag size={20} /> Khám phá sản phẩm
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // --- JSX CHÍNH CỦA TRANG CART ---
  return (
    <>
      <Header />
      {/* Thêm padding-top (pt-32) để nội dung không bị Header che mất */}
      <div className="bg-slate-50 min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* 3. THÊM NÚT QUAY LẠI TRANG CHỦ */}
          <div className="mb-10 flex items-center justify-between gap-4 flex-wrap">
            <button 
              onClick={() => navigate('/')} // Điều hướng về trang home
              className="flex items-center gap-2.5 text-slate-600 hover:text-orange-600 font-bold transition-colors text-sm bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 active:scale-95"
            >
              <ArrowLeft size={18} />
              Quay về Trang chủ
            </button>
            
            {/* Có thể thêm nút xem thêm sản phẩm ở đây nếu muốn */}
            <Link to="/products" className="text-sm font-bold text-orange-600 hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <Plus size={16} /> Xem thêm sản phẩm khác
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* DANH SÁCH SẢN PHẨM */}
            <div className="lg:w-2/3 space-y-6">
              <h1 className="text-4xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <ShoppingBag className="text-orange-600" size={36} />
                Giỏ hàng <span className="text-orange-600">({cartItems.length})</span>
              </h1>
              
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-white hover:border-orange-100 transition-all flex flex-col md:flex-row items-center gap-6 group">
                  <div className="w-28 h-28 bg-slate-50 rounded-3xl p-3 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                    <img src={item.image?.url} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="font-bold text-slate-900 mb-1.5 text-lg group-hover:text-orange-600 transition-colors line-clamp-2">{item.name}</h3>
                    <p className="text-orange-600 font-black text-2xl tracking-tight">{new Intl.NumberFormat('vi-VN').format(item.price)}<span className='text-base ml-0.5'>đ</span></p>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <button onClick={() => openDeleteModal(item)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors self-end md:self-auto">
                      <Trash2 size={20} />
                    </button>
                    <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-100 shadow-inner">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-slate-400 disabled:opacity-40 disabled:hover:bg-transparent"><Minus size={16} /></button>
                      <span className="w-16 text-center font-black text-slate-900 text-xl">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-slate-400"><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TỔNG KẾT */}
            <div className="lg:w-1/3 mt-10 lg:mt-0">
              <div className="bg-white p-9 rounded-[3rem] shadow-2xl shadow-slate-200/40 sticky top-32 border border-white">
                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-wider flex items-center gap-2.5">
                   <Banknote size={28} className="text-orange-600" /> Tóm tắt đơn hàng
                </h2>
                <div className="space-y-5 mb-10">
                  <div className="flex justify-between text-slate-600 font-bold text-base">
                    <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-bold text-base pb-5 border-b border-slate-100">
                    <span>Phí vận chuyển</span>
                    <span className={shippingFee === 0 ? "text-green-500 font-black uppercase tracking-widest text-sm" : "font-black"}>
                      {shippingFee === 0 ? "Miễn phí" : `${new Intl.NumberFormat('vi-VN').format(shippingFee)}đ`}
                    </span>
                  </div>
                  <div className="pt-3 flex justify-between items-end">
                    <span className="text-xl font-bold text-slate-900">Tổng thanh toán</span>
                    <span className="text-4xl font-black text-orange-600 tracking-tighter">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-5.5 bg-orange-600 text-white font-black rounded-3xl hover:bg-slate-900 transition-all shadow-2xl shadow-orange-100 flex items-center justify-center gap-3.5 uppercase text-base tracking-widest active:scale-[0.98]"
                >
                  <CreditCard size={22} /> Đặt hàng ngay
                </button>
                
                {/* <div className="mt-6 text-center">
                    <Link to="/" className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors flex items-center gap-2 justify-center">
                        <Home size={16} /> Hoặc quay lại trang chủ mua thêm
                    </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* --- MODAL XÓA --- */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
            <div className="relative bg-white p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-fadeInUp border border-slate-50">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-7 border-4 border-red-100 shadow-inner"><AlertTriangle size={44} /></div>
              <h3 className="text-3xl font-black text-slate-900 mb-2.5">Xác nhận xóa?</h3>
              <p className="text-slate-500 mb-10 leading-relaxed text-base">Bạn có chắc chắn muốn xóa sản phẩm <span className="font-bold italic text-slate-800">"{productToDelete?.name}"</span> khỏi giỏ hàng?</p>
              <div className="grid grid-cols-2 gap-5">
                <button onClick={() => setIsDeleteModalOpen(false)} className="py-4.5 bg-slate-100 font-bold rounded-2xl text-slate-700 hover:bg-slate-200 transition-colors text-base">Hủy</button>
                <button onClick={confirmDelete} className="py-4.5 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors text-base shadow-lg shadow-red-100">Đồng ý xóa</button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL THANH TOÁN ĐA BƯỚC --- */}
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCheckoutModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-md m-auto rounded-[3rem] overflow-hidden shadow-2xl animate-fadeInUp border border-slate-50">
              <div className="p-9">
                <div className="text-center mb-8">
                  <button onClick={() => setIsCheckoutModalOpen(false)} className="absolute top-7 right-7 text-slate-400 hover:bg-slate-100 hover:text-red-500 p-2 rounded-full transition-colors"><X size={22} /></button>
                  <div className="inline-flex p-4 bg-orange-50 rounded-2xl text-orange-600 mb-4 border border-orange-100 shadow-inner">
                    {checkoutStep === 1 ? <ShoppingBag size={32} /> : <QrCode size={32} />}
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{checkoutStep === 1 ? 'Thông tin nhận hàng' : 'Quét mã thanh toán'}</h3>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-2">Bước {checkoutStep} / 2</p>
                </div>

                {checkoutStep === 1 ? (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-black uppercase text-slate-500 ml-1 mb-2 block tracking-wider">Họ và tên người nhận</label>
                        <input type="text" name="fullName" placeholder="VD: Nguyễn Văn A" value={shippingInfo.fullName} onChange={handleInputChange} className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl focus:border-orange-300 focus:bg-white outline-none font-bold text-base transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase text-slate-500 ml-1 mb-2 block tracking-wider">Số điện thoại liên hệ</label>
                        <input type="text" name="phone" placeholder="VD: 0912345678" value={shippingInfo.phone} onChange={handleInputChange} className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl focus:border-orange-300 focus:bg-white outline-none font-bold text-base transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase text-slate-500 ml-1 mb-2 block tracking-wider">Địa chỉ giao hàng chi tiết</label>
                        <textarea name="address" placeholder="Số nhà, tên đường, phường/xã, quận/huyện..." value={shippingInfo.address} onChange={handleInputChange} rows="3" className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl focus:border-orange-300 focus:bg-white outline-none font-bold text-base transition-all resize-none"></textarea>
                      </div>
                    </div>
                    <button onClick={handleProceedToPayment} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-2.5 text-base active:scale-[0.98]">
                      Tiếp theo bước thanh toán <ArrowLeft size={20} className="rotate-180" />
                    </button>
                  </div>
                ) : (
                  <div className="animate-fadeIn text-center">
                    <div className="bg-slate-50 p-4 rounded-[2.5rem] border-2 border-slate-100 border-dashed mb-8 shadow-inner max-w-[200px] mx-auto">
                      <img src={qrUrl} alt="QR Code" className="w-full aspect-square object-contain mix-blend-multiply" />
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 text-left space-y-2.5 text-sm shadow-inner">
                      <div className="flex justify-between font-bold"> <span className="text-slate-500 uppercase tracking-wider text-xs">Số tiền cần trả:</span> <span className="text-orange-600 font-black text-lg italic">{new Intl.NumberFormat('vi-VN').format(finalTotal)}đ</span> </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-slate-100"> <span className="text-slate-500 uppercase tracking-wider text-xs">Nội dung chuyển khoản:</span> <span className="text-slate-900 italic font-black text-base">{description}</span> </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setCheckoutStep(1)} className="py-4.5 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-colors">Quay lại sửa thông tin</button>
                      <button onClick={handleConfirmPayment} className="py-4.5 bg-orange-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-orange-100 hover:bg-slate-900 transition-colors active:scale-[0.98]"><CheckCircle size={16} /> Tôi đã hoàn tất chuyển khoản</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;