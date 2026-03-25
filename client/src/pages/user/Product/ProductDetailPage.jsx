
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, Minus, Plus } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState("");
  const { addToCart } = useCart();

  const navigate = useNavigate();

const handleAddToCart = () => {
    // THÊM LOGIC KIỂM TRA LOGIN
    const savedUser = localStorage.getItem('user');
    
    if (!savedUser) {
      navigate('/login');
      return;
    }

    // Nếu đã login thì thực hiện logic cũ
    addToCart(product, quantity);
    navigate('/cart');
  };

  // Tìm đến nút "Mua ngay" (thường chưa có logic) bạn có thể thêm tương tự:
  const handleBuyNow = () => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    navigate('/cart');
  };


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        if (data.success) {
          setProduct(data.data);
          setActiveImg(data.data.images[0]?.url);
        }
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi vào trang mới
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-orange-600 font-bold">Đang tải sản phẩm...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center text-red-500 font-bold">Không tìm thấy sản phẩm!</div>;

  return (
    <div className="bg-white pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* CỘT TRÁI: GALLERY ẢNH */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
              <img src={activeImg} alt={product.name} className="w-full h-full object-contain p-8 mix-blend-multiply" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImg(img.url)}
                  className={`w-24 h-24 rounded-lg border-2 flex-shrink-0 p-2 bg-slate-50 transition-all ${activeImg === img.url ? 'border-orange-500' : 'border-transparent'}`}
                >
                  <img src={img.url} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="space-y-2">
              <span className="text-orange-600 font-bold text-sm tracking-widest uppercase">{product.category || 'Công Nghệ'}</span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex text-yellow-400"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600 font-medium">Đã bán {product.sold || 0}</span>
              </div>
            </div>

            <div className="text-4xl font-black text-orange-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </div>

            <p className="text-slate-600 leading-relaxed text-lg border-y py-6 border-slate-100 whitespace-pre-line">
              {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>

            {/* Chỉnh số lượng */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center border border-slate-200 rounded-xl px-2 py-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-orange-600"><Minus size={18}/></button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:text-orange-600"><Plus size={18}/></button>
              </div>
              <span className="text-slate-400 text-sm">Còn lại: {product.stock} sản phẩm</span>
            </div>

            {/* Nút Action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={handleAddToCart} className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl">
                <ShoppingCart size={20} /> Thêm vào giỏ hàng
              </button>
              <button onClick={handleBuyNow} className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-200">
                Mua ngay
              </button>
            </div>

            {/* Đặc điểm cam kết */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-4 rounded-xl">
                <ShieldCheck className="text-orange-500" /> Chính hãng 100%
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-4 rounded-xl">
                <Truck className="text-orange-500" /> Free Ship HN/HCM
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-4 rounded-xl">
                <RotateCcw className="text-orange-500" /> Đổi trả 7 ngày
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;