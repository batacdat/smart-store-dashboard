import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, Store, KeyRound, UserPlus, EyeOff, Eye } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import userImage from '../../assets/anh_bia_dang_nhap.png';

const UserLoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false); 
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ... (Giữ nguyên logic handleSendOTP và handleVerifyOTP của bạn)
const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Lưu ý: Gửi thêm isAdminPortal: false để Backend phân biệt theo Hướng 2
      const { data } = await axios.post('/api/auth/send-otp', { 
        email: formData.email, 
        password: formData.password,
        isAdminPortal: false 
      });
      if (data.success) {
        toast.success("Mã xác thực đã được gửi!");
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/verify-otp', { email: formData.email, otp: formData.otp });
      if (data.success) {
        toast.success("Đăng nhập thành công!");
        navigate('/'); // Điều hướng về trang chủ User
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Mã xác thực không đúng");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      {/* THẺ CARD CHÍNH - Tối ưu kích thước */}
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(13,148,136,0.15)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-white/50">
        
        {/* PHẦN TRÁI: FORM ĐĂNG NHẬP */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center overflow-y-auto no-scrollbar">
          
          <div className="mb-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4 text-teal-600 font-black italic text-xl uppercase tracking-tighter">
              <Store size={24} /> ChongThamBaoLinh
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">Đăng nhập hệ thống</h2>
            <p className="text-slate-400 text-xs font-medium">Nhập thông tin để tiếp tục mua hàng.</p>
          </div>

          <form onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600 transition-colors" size={16} />
                    <input
                      type="email" name="email" required placeholder="customer@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-teal-500 focus:bg-white outline-none transition-all text-sm"
                      value={formData.email} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mật khẩu</label>
                    <Link to="/forgot-password" className="text-[10px] font-bold text-teal-600 hover:underline">Quên mật khẩu?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600 transition-colors" size={16} />
                    <input
                      type={showPass ? "text" : "password"}
                      name="password" required placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-teal-500 focus:bg-white outline-none transition-all text-sm"
                      value={formData.password} onChange={handleChange}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>

                  </div>
                </div>
              </>
            ) : (
              <div className="py-2">
                <input
                  type="text" name="otp" required maxLength="6" placeholder="000000"
                  className="w-full py-4 bg-teal-50/30 border-2 border-teal-100 rounded-xl text-center tracking-[1em] font-black text-2xl text-teal-700 focus:border-teal-600 outline-none transition-all"
                  value={formData.otp} onChange={handleChange}
                />
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-900/10 transition-all active:scale-[0.98] mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <><span className="text-xs uppercase tracking-widest">Đăng nhập</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {step === 1 && (
            <div className="mt-6 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="mx-3 text-[9px] text-slate-300 uppercase font-bold tracking-widest">Hoặc</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>
              
              <button className="w-full py-2.5 border border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-bold text-slate-600 text-xs">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                Tiếp tục với Google
              </button>

              <div className="text-center">
                <p className="text-[11px] text-slate-400 font-medium">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="text-teal-600 font-black hover:underline inline-flex items-center gap-1">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* BÊN PHẢI: ẢNH (Gọn hơn) */}
        <div className="hidden md:block md:w-1/2 p-3 bg-white">
          <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden">
            <img src={userImage} className="absolute inset-0 w-full h-full object-cover" alt="Login Art" />
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-lg font-black italic uppercase">Smart Choice.</h3>
              <p className="text-white/80 text-[11px] leading-relaxed">Nâng tầm trải nghiệm mua sắm của bạn.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserLoginPage;