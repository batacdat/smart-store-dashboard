import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react'; 
import { useCart } from '../../contexts/CartContext';
import LogoBaoLinh from '../../assets/logo-bao-linh.svg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Sử dụng state để quản lý User nhằm kích hoạt re-render
  const [user, setUser] = useState(null);
  const isLoggedIn = !!user;

  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Theo dõi trạng thái đăng nhập
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    checkAuth();
    // Lắng nghe sự kiện thay đổi route để cập nhật lại trạng thái user
  }, [location.pathname]); 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${targetId}`);
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-md py-2 text-slate-800' 
        : 'bg-white/80 backdrop-blur-md py-4 text-slate-900' // Đổi từ transparent sang trắng mờ để thấy chữ
    }`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={LogoBaoLinh} alt="Logo" className="h-10 md:h-12 object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 font-semibold">
          {/* Màu chữ mặc định là text-slate-700 để luôn nhìn thấy rõ */}
          <Link to="/" className="hover:text-orange-600 transition">Home</Link>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-orange-600 transition">About</a>
          <a href="#product" onClick={(e) => handleNavClick(e, 'product')} className="hover:text-orange-600 transition">Product</a>
          <a href="#blog" onClick={(e) => handleNavClick(e, 'blog')} className="hover:text-orange-600 transition">Blog</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-orange-600 transition">Contact</a>

          <div className="flex items-center space-x-4 border-l pl-6 border-slate-300">
            {isLoggedIn ? (
              <>
                {/* Giỏ hàng */}
                <Link to="/cart" className="relative p-2 text-slate-700 hover:text-orange-600 transition">
                  <ShoppingBag size={24} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-slate-300 hover:border-orange-500 transition shadow-sm"
                  >
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                      {user?.name?.charAt(0).toUpperCase() || <User size={18} />}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Tài khoản</p>
                        <p className="font-bold truncate text-slate-900">{user?.name}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition text-sm font-medium"><User size={16}/> Hồ sơ của tôi</Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm font-medium">
                        <LogOut size={16}/> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-700 hover:text-orange-600 transition font-bold">Login</Link>
                <Link to="/register" className="px-6 py-2.5 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition shadow-lg shadow-orange-200">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Button */}
        <button className="md:hidden p-2 text-slate-800" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t p-6 flex flex-col gap-4 font-bold text-slate-800">
          <Link to="/" className="hover:text-orange-600 transition">Home</Link>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-orange-600 transition">About</a>
          <a href="#product" onClick={(e) => handleNavClick(e, 'product')} className="hover:text-orange-600 transition">Product</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-orange-600 transition">Contact</a>
          <Link to="/blog" className="hover:text-orange-600 transition">Blog</Link>
          {isLoggedIn ? (
            <div className="pt-4 border-t space-y-4">
              <Link to="/cart" className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span>Giỏ hàng</span>
                <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs">{totalItems}</span>
              </Link>
              <Link to="/profile" className="block p-3">Hồ sơ cá nhân</Link>
              <button onClick={handleLogout} className="w-full text-left p-3 text-red-600">Đăng xuất</button>
            </div>
          ) : (
            <div className="pt-4 border-t flex flex-col gap-3">
              <Link to="/login" className="w-full py-3 text-center border border-slate-200 rounded-xl hover:text-orange-600">Login</Link>
              <Link to="/register" className="w-full py-3 text-center bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;