import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2, Store, EyeOff, Eye, Phone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import userImage from '../../assets/shopping.jpg';

const UserLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false); 
  const [formData, setFormData] = useState({ phone: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
        isAdminPortal: false 
      });

      if (data.success) {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        navigate('/'); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Số điện thoại hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* CSS ẩn thanh trượt */}
      <style>{`
        ::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; overflow: hidden; }
      `}</style>

      {/* Card Wrapper - Kích thước y hệt trang Register */}
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 flex overflow-hidden border border-white">
        
        {/* PHẦN TRÁI: FORM ĐĂNG NHẬP */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 text-indigo-600 font-black italic text-xl uppercase tracking-tighter ">
              <Store size={24} /> ChongThamBaoLinh
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Đăng nhập</h2>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider mt-2">Tiếp tục hành trình mua sắm của bạn</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Số điện thoại */}
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  name="phone"
                  placeholder="098xxx"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-indigo-100 transition-all text-sm font-bold text-slate-700"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mật khẩu</label>
                <Link to="/forgot-password" size={18} className="text-[10px] font-bold text-indigo-600 uppercase hover:underline">Quên mật khẩu?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-indigo-100 transition-all text-sm font-bold text-slate-700"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Nút Đăng nhập */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase text-[11px] tracking-wider shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  Đăng nhập ngay
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          {/* Footer Form */}
          <div className="mt-8 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase">Hoặc</span>
            </div>

            <button className="w-full py-3.5 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-200 transition-all font-bold text-slate-600 text-xs">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
              Tiếp tục với Google
            </button>

            <div className="text-center mt-4">
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-indigo-600 font-black hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* PHẦN PHẢI: ẢNH (GIỮ NGUYÊN STYLE TRANG REGISTER) */}
        <div className="hidden md:block md:w-1/2 p-3 bg-white">
          <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden group">
            <img 
              src={userImage} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Shopping Art" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-xl font-black italic uppercase">Smart Choice.</h3>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">Trải nghiệm mua sắm công nghệ đỉnh cao</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserLoginPage;