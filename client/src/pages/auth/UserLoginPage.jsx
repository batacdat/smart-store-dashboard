import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2, Store, EyeOff, Eye, Phone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import userImage from '../../assets/anh_bia_dang_nhap.png';

const UserLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false); 
  const [formData, setFormData] = useState({ phone: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Logic đăng nhập thẳng, không qua OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password) {
      return toast.error("Vui lòng nhập đầy đủ số điện thoại và mật khẩu");
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { 
        phone: formData.phone, 
        password: formData.password,
        isAdminPortal: false // Luồng dành cho người dùng
      });

      if (data.success) {
        toast.success("Đăng nhập thành công!");
        // Lưu thông tin vào localStorage (tùy thuộc vào cách bạn quản lý state)
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        
        // Chuyển hướng vào trang mua sắm
        navigate('/'); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Số điện thoại hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 flex overflow-hidden border border-white">
        
        {/* BÊN TRÁI: FORM ĐĂNG NHẬP */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
              <Store size={28} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Chào mừng trở lại</h2>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mt-2">Đăng nhập để tiếp tục mua sắm</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5 relative group">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  name="phone"
                  placeholder="098xxx"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-100 transition-all text-sm font-bold text-slate-700"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 relative group">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mật khẩu</label>
                <button 
                  type="button"
                  onClick={() => navigate('/forgot-password')} 
                  className="text-[10px] font-black text-teal-600 uppercase hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" size={18} />
                <input 
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-100 transition-all text-sm font-bold text-slate-700"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-teal-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  Đăng nhập ngay
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest">Hoặc</span>
            </div>

            <button className="w-full py-4 border border-slate-100 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-bold text-slate-600 text-xs">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
              Tiếp tục với Google
            </button>

            <div className="text-center">
              <p className="text-[11px] text-slate-400 font-medium">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-teal-600 font-black hover:underline inline-flex items-center gap-1 uppercase tracking-wider">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* BÊN PHẢI: ẢNH (GIỮ NGUYÊN) */}
        <div className="hidden md:block md:w-1/2 p-3 bg-white">
          <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden">
            <img src={userImage} className="absolute inset-0 w-full h-full object-cover" alt="Login Art" />
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-lg font-black italic uppercase">Smart Choice.</h3>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">Trải nghiệm mua sắm công nghệ đỉnh cao</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserLoginPage;