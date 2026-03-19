import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import UserLoginPage from './pages/auth/UserLoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import UserRegisterPage from './pages/auth/UserRegisterPage';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement'; // File bạn vừa tạo
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import ForgotPassword from './pages/auth/ForgotPassword';

function App() {
  const location = useLocation();
  const [isCollapsed, setisCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAuthPage = ['/login', '/system-gateway', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex overflow-hidden font-sans"> 
      
      {!isAuthPage && (
        <Sidebar 
          isCollapsed={isCollapsed} 
          setisCollapsed={setisCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
      )}

      <div className="flex-1 overflow-y-auto h-screen relative flex flex-col">
        {/* Header Mobile */}
        {!isAuthPage && (
          <header className="bg-white border-b border-slate-100 p-4 flex items-center lg:hidden sticky top-0 z-30">
            <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-600 rounded-lg">
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-black text-slate-800 ml-4">Smart Store</h1>
          </header>
        )}

        <div className="relative z-10 flex-grow">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="/register" element={<UserRegisterPage />} />
            <Route path="/system-gateway" element={<AdminLoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            
            {/* Sản phẩm */}
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/product/:id" element={<EditProduct />} />
            
            {/* Đơn hàng */}
            <Route path="/admin/orders" element={<div className="p-8">Trang quản lý đơn hàng</div>} />
            <Route path="/admin/returns" element={<div className="p-8">Trang quản lý trả hàng</div>} />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>

          
        </div>
      </div>
    </div>
  );
}

export default App;