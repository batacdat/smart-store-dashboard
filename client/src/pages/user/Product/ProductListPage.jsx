import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Eye, Star, Filter, Search, ChevronRight } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/products');
        if (res.data.success) {
          setProducts(res.data.data);
          // Lấy danh sách danh mục duy nhất từ sản phẩm
          const uniqueCats = ['Tất cả', ...new Set(res.data.data.map(p => p.category))];
          setCategories(uniqueCats);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  // Logic lọc sản phẩm
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* 1. BREADCRUMB & TIÊU ĐỀ */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-orange-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900">Sản phẩm</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900">
            Tất cả <span className="text-orange-600">Sản phẩm</span>
          </h1>
        </div>

        {/* 2. BỘ LỌC VÀ TÌM KIẾM */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
          {/* Lọc theo danh mục */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' 
                  : 'bg-white text-slate-500 hover:bg-orange-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none font-medium"
            />
          </div>
        </div>

        {/* 3. DANH SÁCH SẢN PHẨM */}
        {loading ? (
          <div className="py-20 text-center font-bold text-slate-400 italic">Đang tải danh sách sản phẩm...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-500 flex flex-col h-full">
                
                {/* Ảnh sản phẩm */}
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300'} 
                    alt={product.name}
                    className="w-full h-full object-contain p-6 transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Badge danh mục */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-orange-600 rounded-lg shadow-sm">
                      {product.category}
                    </span>
                  </div>
                  {/* Overlay khi hover */}
                  <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button 
                      onClick={() => handleQuickAddToCart(product)}
                      className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-xl hover:bg-orange-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                    >
                      <ShoppingCart size={20} />
                    </button>
                    <Link 
                      to={`/product/${product._id}`}
                      className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl hover:bg-slate-900 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
                    >
                      <Eye size={20} />
                    </Link>
                  </div>
                </div>

                {/* Thông tin */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-1 text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl md:text-2xl font-black text-orange-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Đã bán {product.sold || 50}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold text-xl">Không tìm thấy sản phẩm nào phù hợp.</p>
            <button 
              onClick={() => {setSelectedCategory('Tất cả'); setSearchTerm('');}}
              className="mt-4 text-orange-600 font-black uppercase text-sm"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;