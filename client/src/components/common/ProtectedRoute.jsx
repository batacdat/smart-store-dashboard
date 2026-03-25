import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const user = localStorage.getItem('user');
  
  // Nếu không có user, chuyển hướng về login ngay lập tức
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;