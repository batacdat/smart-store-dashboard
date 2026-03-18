import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, Store, KeyRound, ShieldCheck, EyeOff, Eye } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import userImage from '../../assets/anh_bia_dang_nhap.png';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Bước 1: Gửi mail, Bước 2: Reset pass
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    otp: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Xử lý Gửi OTP (Bước 1)
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.email) return toast.error("Vui lòng nhập email");

    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/forgot-password', { email: formData.email });
      if (data.success) {
        toast.success("Mã OTP đã được gửi vào Email của bạn!");
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi gửi yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Đặt lại mật khẩu (Bước 2)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp");
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/reset-password', {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      if (data.success) {
        toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Mã OTP không đúng hoặc hết hạn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 flex overflow-hidden border border-white">
        
        {/* BÊN TRÁI: FORM XỬ LÝ */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
              {step === 1 ? <KeyRound size={28} /> : <ShieldCheck size={28} />}
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">
              {step === 1 ? "Quên mật khẩu?" : "Đặt lại mật khẩu"}
            </h2>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mt-2 leading-relaxed">
              {step === 1 
                ? "Nhập email để nhận mã xác thực OTP" 
                : `Mã đã gửi tới: ${formData.email}`}
            </p>
          </div>

          {step === 1 ? (
            /* FORM BƯỚC 1: NHẬP EMAIL */
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email khôi phục</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" size={18} />
                  <input 
                    type="email" name="email" placeholder="example@gmail.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-100 transition-all text-sm font-bold text-slate-700"
                    value={formData.email} onChange={handleChange} required
                  />
                </div>
              </div>
              <button 
                type="submit" disabled={loading}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-teal-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Gửi mã OTP <ArrowRight size={18} /></>}
              </button>
            </form>
          ) : (
            /* FORM BƯỚC 2: NHẬP OTP & PASS MỚI */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mã xác thực OTP</label>
                <input 
                  type="text" name="otp" placeholder="Nhập 6 số"
                  className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-100 transition-all text-sm font-bold text-slate-700 tracking-[0.5em] text-center"
                  value={formData.otp} onChange={handleChange} required
                />
              </div>

              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mật khẩu mới</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" size={18} />
                  <input 
                    type={showPass ? "text" : "password"} name="newPassword" placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-100 transition-all text-sm font-bold text-slate-700"
                    value={formData.newPassword} onChange={handleChange} required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="password" name="confirmPassword" placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-100 transition-all text-sm font-bold text-slate-700"
                    value={formData.confirmPassword} onChange={handleChange} required
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-teal-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Xác nhận thay đổi"}
              </button>
              
              <button 
                type="button" onClick={() => setStep(1)}
                className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-colors"
              >
                Gửi lại mã khác?
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-slate-50 pt-6">
            <Link to="/login" className="text-teal-600 font-black hover:underline inline-flex items-center gap-2 uppercase text-[11px] tracking-widest">
              Quay lại đăng nhập
            </Link>
          </div>
        </div>

        {/* BÊN PHẢI: ẢNH (GIỮ NGUYÊN STYLE) */}
        <div className="hidden md:block md:w-1/2 p-3 bg-white">
          <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden">
            <img src={userImage} className="absolute inset-0 w-full h-full object-cover" alt="Forgot Password Art" />
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white text-center">
              <h3 className="text-lg font-black italic uppercase leading-tight">Bảo vệ tài khoản.</h3>
              <p className="text-[9px] font-bold text-white/70 uppercase tracking-[0.3em] mt-2 leading-relaxed">Xác thực OTP giúp tài khoản của bạn luôn an toàn trước mọi xâm nhập</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;