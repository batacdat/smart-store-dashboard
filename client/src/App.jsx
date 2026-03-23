import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import UserLoginPage from './pages/auth/UserLoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import UserRegisterPage from './pages/auth/UserRegisterPage';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/Product/ProductManagement'; // File bạn vừa tạo
import AddProduct from './pages/admin/Product/AddProduct';
import EditProduct from './pages/admin/Product/EditProduct';
import ForgotPassword from './pages/auth/ForgotPassword';
import UserLayout from './components/layout/UserLayout';
import HomePage from './pages/user/Home/HomePage';
import ProductDetailPage from './pages/user/ProductDetail/ProductDetailPage';
import CartPage from './pages/user/Cart/CartPage';
import CreateBlog from './pages/admin/Blog/CreateBlog';
import BlogManagement from './pages/admin/Blog/BlogManagement';
import BlogDetailPage from './pages/user/Blog/BlogDetailPage';


function App() {
  const location = useLocation();
  const [isCollapsed, setisCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Kiểm tra xem có phải đang ở trang Admin hay không
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/system-gateway', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans"> 
      
      {/* TRƯỜNG HỢP 1: GIAO DIỆN ADMIN (Cần Sidebar) */}
      {isAdminPage && (
        <div className="flex overflow-hidden h-screen">
          <Sidebar 
            isCollapsed={isCollapsed} 
            setisCollapsed={setisCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
          <div className="flex-1 overflow-y-auto relative flex flex-col">
            <header className="bg-white border-b border-slate-100 p-4 flex items-center lg:hidden sticky top-0 z-30">
              <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-600 rounded-lg">
                <Menu size={24} />
              </button>
              <h1 className="text-lg font-black text-slate-800 ml-4">Smart Store Admin</h1>
            </header>
            <main className="flex-grow">
              <Routes>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/add-product" element={<AddProduct />} />
                <Route path="/admin/product/:id" element={<EditProduct />} />
                <Route path="/admin/orders" element={<div className="p-8">Quản lý đơn hàng</div>} />
                <Route path="/admin/returns" element={<div className="p-8">Quản lý trả hàng</div>} />
                <Route path="/admin/blog" element={<BlogManagement />} />
                <Route path="/admin/blog/create" element={<CreateBlog />} />
                
              </Routes>
            </main>
          </div>
        </div>
      )}

      {/* TRƯỜNG HỢP 2: GIAO DIỆN USER & AUTH (Không Sidebar, Tràn màn hình) */}
      {!isAdminPage && (
        <div className="w-full">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="/register" element={<UserRegisterPage />} />
            <Route path="/system-gateway" element={<AdminLoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* User Routes - Bọc bởi UserLayout */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<HomePage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
            </Route>

            {/* Điều hướng mặc định */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;