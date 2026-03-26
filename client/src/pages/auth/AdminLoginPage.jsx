import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Store, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import adminImage from '../../assets/anh_bia_dang_nhap.png'; 

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Gửi isAdminPortal: true để Backend xác thực quyền Admin ngay từ bước 1
      const { data } = await axios.post('/auth/send-otp', { 
        email: formData.email, 
        password: formData.password,
        isAdminPortal: true 
      });
      if (data.success) {
        toast.success("Mã xác thực Admin đã gửi!");
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi truy cập hệ thống");
    } finally {
      setLoading(false);
    }
  };

const handleVerifyOTP = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const { data } = await axios.post('/auth/verify-otp', { 
      email: formData.email, 
      otp: formData.otp 
    });
    
    if (data.success) {
      // ❌ KHÔNG lưu token vào localStorage
      // localStorage.setItem('token', data.token);
      
      // Chỉ lưu thông tin user (không có token)
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success("Xác thực quản trị viên thành công!");
      navigate('/admin/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data);
    toast.error(error.response?.data?.message || "OTP không chính xác");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      {/* THẺ CARD CHÍNH - Thu gọn max-w-4xl và max-h-90vh */}
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_25px_80px_-20px_rgba(30,58,138,0.2)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-slate-100 relative z-10">
        
        {/* PHẦN TRÁI: FORM ĐĂNG NHẬP ADMIN */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center overflow-y-auto no-scrollbar bg-white">
          
          <div className="mb-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="w-10 h-10 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                <ShieldCheck size={22} />
              </div>
              <span className="font-bold text-[#1e3a8a] text-xl tracking-tight uppercase italic">Admin Portal</span>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Hệ thống Quản trị</h2>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Authorized Personnel Only</p>
          </div>

          <form onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Admin Account</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1e3a8a] transition-colors" size={16} />
                    <input
                      type="email" name="email" required placeholder="admin@system.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#1e3a8a] focus:bg-white outline-none transition-all text-sm font-medium"
                      value={formData.email} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Master Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1e3a8a] transition-colors" size={16} />
                    <input
                      type="password" name="password" required placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#1e3a8a] focus:bg-white outline-none transition-all text-sm font-medium"
                      value={formData.password} onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="py-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center block mb-3">Nhập mã Security OTP</label>
                <input
                  type="text" name="otp" required maxLength="6" placeholder="000000"
                  className="w-full py-4 bg-blue-50/30 border-2 border-blue-100 rounded-xl text-center tracking-[1em] font-black text-2xl text-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all"
                  value={formData.otp} onChange={handleChange}
                />
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <><span className="text-xs uppercase tracking-widest">{step === 1 ? "Xác thực" : "Vào Dashboard"}</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {step === 2 && (
            <button 
              onClick={() => setStep(1)} 
              className="mt-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#1e3a8a] transition-colors text-center w-full"
            >
              Quay lại trang trước
            </button>
          )}

          <div className="mt-8 pt-6 border-t border-slate-50">
             <p className="text-center text-[9px] text-slate-300 font-medium uppercase tracking-widest leading-relaxed">
               All access attempts are logged <br /> & end-to-end encrypted.
             </p>
          </div>
        </div>

        {/* PHẦN PHẢI: ẢNH (Bố cục gọn) */}
        <div className="hidden md:block md:w-1/2 p-3 bg-white">
          <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden group">
            <img 
              src={adminImage} 
              alt="Admin Access" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1e3a8a]/40 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="inline-block px-2 py-0.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-[8px] font-bold uppercase tracking-widest mb-2">
                System Security v4.0
              </div>
              <h3 className="text-lg font-black italic uppercase leading-tight mb-1">Control Center.</h3>
              <p className="text-white/70 text-[10px] font-medium">Bảo mật đa tầng cho hệ thống doanh nghiệp.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;