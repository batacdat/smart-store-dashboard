import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, Shield, AlertCircle, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import logo from '../../assets/logo-bao-linh.svg';
import userImage from '../../assets/shopping.jpg';

const UserChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng nhập
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      if (response.data.success) {
        toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', {
          duration: 4000,
          position: 'top-right'
        });
        
        // Đăng xuất và chuyển về trang login
        setTimeout(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại', {
        duration: 4000,
        position: 'top-right'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6">
      {/* CARD CHÍNH - Gộp cả Form và Ảnh vào đây */}
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-orange-100/50 border border-orange-50">
        
        {/* PHẦN TRÁI: FORM NHẬP LIỆU */}
        <div className="w-full md:w-1/2 p-8 lg:p-14 flex flex-col">
          <div className="w-full max-w-md mx-auto my-auto">
          <div className="mb-10">
            {/* Icon Store với tông Indigo */}
            <div className="flex items-center gap-2 mb-4 text-orange-600 font-black italic text-xl uppercase tracking-tighter ">
              <img src={logo} alt="Logo" className="h-8" />
              chongthambaolinh
            </div>

              
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                Đổi mật khẩu
              </h2>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mt-2 leading-relaxed">
                Thiết lập mật khẩu mới cho tài khoản
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mật khẩu hiện tại */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mật khẩu hiện tại</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    required
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-orange-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mật khẩu mới</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key size={18} className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Xác nhận mật khẩu</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield size={18} className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-200 hover:bg-orange-700 hover:shadow-orange-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-6 disabled:bg-slate-300 disabled:shadow-none"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Xác nhận cập nhật"}
              </button>
            </form>

            <div className="mt-10 flex flex-col items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-orange-600 transition-colors uppercase tracking-widest"
              >
                <ArrowLeft size={14} /> Quay lại trang trước
              </button>
            </div>
          </div>
        </div>

        {/* PHẦN PHẢI: ẢNH (Ẩn trên mobile, hiện trên desktop - Clone từ trang Login) */}
        <div className="hidden md:block md:w-1/2 p-3 bg-white">
          <div className="relative h-full w-full rounded-[2rem] overflow-hidden group shadow-inner">
            <img 
              src={userImage} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Security Decor" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <h3 className="text-2xl font-black italic uppercase leading-none">An toàn hơn.</h3>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-4 max-w-xs leading-relaxed">
                Việc thay đổi mật khẩu định kỳ giúp tài khoản của bạn luôn được bảo vệ tốt nhất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChangePassword;