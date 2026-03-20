import React, { useState } from 'react';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  
  // State quản lý Modal xóa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Hàm mở modal và lưu sản phẩm chờ xóa
  const openDeleteModal = (item) => {
    setProductToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Hàm xác nhận xóa thực sự từ Modal
  const confirmDelete = () => {
    if (productToDelete) {
      removeFromCart(productToDelete._id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Giao diện khi giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-white">
        <div className="bg-slate-50 p-8 rounded-full">
          <ShoppingBag size={80} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
        <p className="text-slate-500">Hãy chọn cho mình những sản phẩm công nghệ tuyệt vời nhé!</p>
        <Link to="/" className="mt-4 px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="p-2 bg-white rounded-full shadow-sm hover:text-orange-600 transition">
                <ArrowLeft size={20}/>
            </Link>
            <h1 className="text-3xl font-black text-slate-900">Giỏ hàng ({cartItems.length})</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-6 border border-slate-100">
                <div className="w-24 h-24 flex-shrink-0 bg-slate-50 rounded-xl p-2">
                    <img src={item.images && item.images[0]?.url} alt={item.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{item.name}</h3>
                  <p className="text-orange-600 font-black text-xl mt-1">
                    {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                  </p>
                </div>
                
                <div className="flex items-center gap-6">
                    {/* Bộ tăng giảm số lượng */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-2 px-3 hover:bg-white hover:text-orange-600 transition-colors"
                        >
                            <Minus size={16}/>
                        </button>
                        <span className="w-10 text-center font-bold text-slate-800">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-2 px-3 hover:bg-white hover:text-orange-600 transition-colors"
                        >
                            <Plus size={16}/>
                        </button>
                    </div>

                    {/* Nút xóa mở Modal */}
                    <button 
                        onClick={() => openDeleteModal(item)}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <Trash2 size={22} />
                    </button>
                </div>
              </div>
            ))}
          </div>

          {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6 border border-slate-100 sticky top-28">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-4">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-slate-500">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-slate-800">{new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</span>
                </div>
                <div className="flex justify-between text-slate-500">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 border-t">
                <span className="text-slate-900 font-bold">Tổng cộng</span>
                <div className="text-right">
                    <p className="text-3xl font-black text-orange-600">{new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</p>
                    <p className="text-xs text-slate-400 mt-1">(Đã bao gồm VAT nếu có)</p>
                </div>
              </div>

              <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CUSTOM DELETE MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Lớp nền đen mờ (Overlay) */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>

          {/* Hộp thoại Modal */}
          <div className="relative bg-white rounded-[32px] shadow-2xl max-w-sm w-full p-8 overflow-hidden transform transition-all animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Icon cảnh báo tròn */}
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
                <AlertTriangle size={40} />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2">Xác nhận xóa?</h3>
              <p className="text-slate-500 leading-relaxed">
                Bạn có chắc muốn xóa <span className="font-bold text-slate-800">"{productToDelete?.name}"</span> khỏi giỏ hàng?
              </p>

              {/* Nút thao tác */}
              <div className="grid grid-cols-2 gap-4 w-full mt-8">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="py-4 px-6 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={confirmDelete}
                  className="py-4 px-6 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                  Đồng ý xóa
                </button>
              </div>
            </div>

            {/* Nút X đóng nhanh ở góc */}
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;