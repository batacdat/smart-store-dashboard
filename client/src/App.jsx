import { Routes, Route, Navigate } from 'react-router-dom'

import UserLoginPage from './pages/auth/UserLoginPage'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import UserRegisterPage from './pages/auth/UserRegisterPage'

function App() {
  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-hidden"> 
      {/* Background Glow - Đặt z-0 để luôn nằm dưới cùng */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-60" 
        style={{
          backgroundImage: `
       radial-gradient(circle at center, #93c5fd, transparent)
     `,

        }} 
      />

      {/* Content Wrapper - Đặt z-10 để luôn nổi lên trên */}
<Routes>
  {/* Cổng đăng nhập cho Người dùng bình thường */}
  <Route path="/login" element={<UserLoginPage />} />
  
  {/* Cổng đăng nhập cho Quản trị viên (Tách biệt hoàn toàn) */}
  <Route path="/system-gateway" element={<AdminLoginPage />} />

  {/* Điều hướng mặc định */}
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/register" element={<UserRegisterPage />} />
</Routes>
      
    </div>
  )
}

export default App