import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
// Thêm nếu dùng Redux
import UserLoginPage from './pages/auth/UserLoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import UserRegisterPage from './pages/auth/UserRegisterPage';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/Product/ProductManagement';
import AddProduct from './pages/admin/Product/AddProduct';
import EditProduct from './pages/admin/Product/EditProduct';
import ForgotPassword from './pages/auth/ForgotPassword';
import UserLayout from './components/layout/UserLayout';
import HomePage from './pages/user/Home/HomePage';
import ProductDetailPage from './pages/user/Product/ProductDetailPage';
import CartPage from './pages/user/Cart/CartPage';
import CreateBlog from './pages/admin/Blog/CreateBlog';
import BlogManagement from './pages/admin/Blog/BlogManagement';
import BlogDetailPage from './pages/user/Blog/BlogDetailPage';
import ProductListPage from './pages/user/Product/ProductListPage';
import BlogListPage from './pages/user/Blog/BlogListPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminOrderManagement from './pages/admin/Order/AdminOrderManagement';
import AdminOrderDetail from './pages/admin/Order/AdminOrderDetail';
import OrderHistory from './pages/user/Order/OrderHistory';
import { SocketProvider } from './contexts/SocketContext'; // Import SocketProvider
import { getSocket } from './utils/socket'; // Import getSocket

function App() {
  const location = useLocation();
  const [isCollapsed, setisCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Lấy thông tin user từ Redux (hoặc context)
  // const { user } = useSelector(state => state.auth);
  const user = null; // Thay bằng logic lấy user của bạn

  // Đăng ký socket khi user đăng nhập
  useEffect(() => {
    if (user) {
      const socket = getSocket();
      
      // Đăng ký user với socket
      socket.emit('register-user', user.id);
      socket.emit('user-join', user.id);
      
      // Nếu là admin, đăng ký thêm admin events
      if (user.role === 'admin') {
        socket.emit('register-admin', user.id);
        socket.emit('admin-join');
      }
      
      console.log(`Registered ${user.role} with socket:`, user.id);
    }
  }, [user]);

  // Kiểm tra xem có phải đang ở trang Admin hay không
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/system-gateway', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <SocketProvider> {/* Wrap toàn bộ app với SocketProvider */}
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
                <h1 className="text-lg font-black text-slate-800 ml-4"> CTBL Admin</h1>
              </header>
              <main className="flex-grow">
                <Routes>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/products" element={<ProductManagement />} />
                  <Route path="/admin/add-product" element={<AddProduct />} />
                  <Route path="/admin/product/:id" element={<EditProduct />} />
                  <Route path="/admin/orders" element={<AdminOrderManagement />} />
                  <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
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
                <Route path="products" element={<ProductListPage />} />
                <Route path="/blog/:slug" element={<BlogDetailPage />} />
                <Route path="blog" element={<BlogListPage />} />
                <Route path="/orders/history" element={<OrderHistory />} />
              </Route>
              
              {/* Các trang BẮT BUỘC ĐĂNG NHẬP mới vào được */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<CartPage />} />
              </Route>
              
              {/* Điều hướng mặc định */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        )}
      </div>
    </SocketProvider>
  );
}

export default App;