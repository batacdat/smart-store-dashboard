import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Thêm useNavigate
import axios from 'axios';
import { ShoppingCart, Eye, Star, PackageSearch, ArrowRight } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';


const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); // 3. Khởi tạo navigate
  const { addToCart } = useCart(); // 4. Lấy hàm addToCart

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products'); 
        if (response.data && response.data.success) {
          setProducts(response.data.data.slice(0, 8)); 
        }
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 5. Hàm xử lý khi nhấn vào icon giỏ hàng
const handleQuickAddToCart = (product) => {
    // THÊM LOGIC KIỂM TRA LOGIN
    const savedUser = localStorage.getItem('user');
    
    if (!savedUser) {
      navigate('/login');
      return;
    }

    // Nếu đã login thì mới thực hiện logic cũ
    addToCart(product, 1);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center mb-12">
        <span className="text-orange-600 font-black uppercase tracking-widest text-sm">Sản phẩm nổi bật</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 tracking-wider">Giải Pháp Công Nghệ Mới Nhất</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300'} 
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-4"
                />
                
                {/* Overlay khi hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  {/* 6. Thay đổi button ở đây */}
                  <button 
                    onClick={() => handleQuickAddToCart(product)}
                    className="p-3 bg-white rounded-full text-slate-900 hover:bg-orange-600 hover:text-white transition-colors shadow-lg"
                  >
                    <ShoppingCart size={20} />
                  </button>
                  
                  <Link to={`/product/${product._id}`} className="p-3 bg-white rounded-full text-slate-900 hover:bg-orange-600 hover:text-white transition-colors shadow-lg">
                    <Eye size={20} />
                  </Link>
                </div>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-center gap-1 text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  <span className="text-xs text-slate-400 ml-1">(4.5)</span>
                </div>
                
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-black text-orange-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </span>
                  <span className="text-xs font-medium text-slate-400">Đã bán {product.sold || 0}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Chưa có sản phẩm nào để hiển thị.
          </div>
        )}
      </div>
        {/* --- NÚT XEM TẤT CẢ (MỚI THÊM) --- */}
        <div className="mt-16 flex justify-center">
          <Link 
            to="/products" // Đường dẫn tới trang ProductList của bạn
            className="group relative flex items-center gap-4 bg-white   text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95"
          >
            <div className="absolute -inset-1 bg-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
            
            <PackageSearch size={20} className="text-orange-400 group-hover:text-white transition-colors" />
            <span>Xem tất cả sản phẩm</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
        {/* ------------------------------- */}
    </div>
  );
};

export default ProductSection;