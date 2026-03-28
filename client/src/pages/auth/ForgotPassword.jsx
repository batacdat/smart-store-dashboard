import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, Store, KeyRound, ShieldCheck, EyeOff, Eye, Phone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
// Đảm bảo đường dẫn ảnh này chính xác trong dự án của bạn
import userImage from '../../assets/shopping.jpg'; 
import logo from '../../assets/logo-bao-linh.svg';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [formData, setFormData] = useState({ 
    phone: '',
    email: '',
    otp: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.email) {
        return toast.error("Vui lòng nhập đầy đủ số điện thoại và email nhận mã");
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/forgot-password', { 
        phone: formData.phone, 
        email: formData.email 
      });
      if (data.success) {
        toast.success("Mã OTP đã được gửi đến email của bạn!");
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể gửi mã OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp");
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/reset-password', {
        phone: formData.phone,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      if (data.success) {
        // Xóa sạch thông tin đăng nhập cũ để tránh lỗi 401
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('refreshToken');
        toast.success("Đặt lại mật khẩu thành công!");
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Cấu trúc Card Wrapper y hệt trang Login */}
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 flex overflow-hidden border border-white">
        
        {/* BÊN TRÁI: FORM (Cập nhật padding và spacing giống Login) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center animate-fade-in">
          <div className="mb-10">
            {/* Icon Store với tông Indigo */}
            <div className="flex items-center gap-2 mb-4 text-orange-600 font-black italic text-xl uppercase tracking-tighter ">
              <img src={logo} alt="Logo" className="h-8" />
              chongthambaolinh
            </div>

            {/* Tiêu đề chữ lớn, in hoa, nghiêng giống Login */}
            <h2 className="text-2xl md:text-3xl font-black text-slate-700 tracking-tight italic uppercase leading-tight">
              {step === 1 ? "Quên mật khẩu?" : "Xác thực OTP"}
            </h2>
            {/* Subtitle chữ nhỏ, spacing rộng giống Login */}
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mt-2 leading-relaxed">
              {step === 1 
                ? "Nhập SĐT tài khoản và Email để nhận mã khôi phục" 
                : `Mã đã gửi đến email đăng ký`}
            </p>
          </div>

          {step === 1 ? (
            /* FORM BƯỚC 1: NHẬP SĐT & EMAIL */
            <form onSubmit={handleSendOTP} className="space-y-5 animate-slide-in-right">
              {/* Ô nhập Số điện thoại */}
              <div className="space-y-1.5 group relative">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Số điện thoại tài khoản</label>
                <div className="relative relative-input-group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl outline-none focus:border-orange-100 focus:bg-white transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
                    placeholder="09xxxxxxxxx"
                    required
                  />
                </div>
              </div>

              {/* Ô nhập Email nhận mã */}
              <div className="space-y-1.5 group relative">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Email nhận mã OTP</label>
                <div className="relative relative-input-group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl outline-none focus:border-orange-100 focus:bg-white transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
              </div>

              {/* Nút gửi mã (Tông Indigo) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-orange-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 mt-6"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                  <>
                    Gửi mã xác nhận
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* FORM BƯỚC 2: NHẬP OTP & PASS MỚI */
            <form onSubmit={handleResetPassword} className="space-y-4 animate-slide-in-right">
              {/* Ô nhập mã OTP */}
              <div className="space-y-group relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mã xác thực OTP</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 transition-colors" />
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl outline-none focus:border-orange-100 focus:bg-white transition-all text-sm font-bold text-slate-700 tracking-[0.5em] text-center"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              {/* Ô nhập Mật khẩu mới */}
              <div className="space-y-group relative group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mật khẩu mới</label>
                <div className="relative relative-input-group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-transparent rounded-xl outline-none focus:border-orange-100 focus:bg-white transition-all text-sm font-bold text-slate-700"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors z-10 p-1"
                  >
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Ô nhập Xác nhận mật khẩu */}
              <div className="space-y-group relative group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Xác nhận mật khẩu</label>
                <div className="relative relative-input-group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-transparent rounded-xl outline-none focus:border-orange-100 focus:bg-white transition-all text-sm font-bold text-slate-700"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors z-10 p-1"
                  >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Nút cập nhật (Tông Indigo) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-orange-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 mt-6"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Cập nhật mật khẩu"}
              </button>
              
              {/* Nút quay lại bước 1 */}
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600 transition-colors pt-3"
              >
                Nhập lại thông tin khác?
              </button>
            </form>
          )}

          {/* Footer Form (Đồng bộ khoảng cách và màu sắc) */}
          <div className="mt-10 text-center border-t border-slate-50 pt-6">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Đã nhớ mật khẩu?{' '}
              <Link to="/login" className="text-orange-600 font-black hover:underline inline-flex items-center gap-1">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>

        {/* PHẦN PHẢI: ẢNH (Đồng bộ Gradient sang Indigo) */}
        <div className="hidden md:block md:w-1/2 p-3 bg-white">
          <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden group">
            <img 
              src={userImage} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Forgot Password Art" 
            />
            {/* Gradient tông Indigo sâu hơn giống Login */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-xl font-black italic uppercase">Smart Choice.</h3>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">Hệ thống bảo mật tối ưu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;