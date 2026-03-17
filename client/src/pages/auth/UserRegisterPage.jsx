import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Store, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import userImage from '../../assets/anh_bia_dang_nhap.png';

const UserRegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false); // Trạng thái ẩn hiện pass
  const [showRePass, setShowRePass] = useState(false); // Trạng thái ẩn hiện repass
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    repassword: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleRegister = async (e) => {
    e.preventDefault();
    
    // Kiểm tra nhanh ở client
    if (formData.password.length < 6) {
      return toast.error("Mật khẩu phải ít nhất 6 ký tự");
    }
    if (formData.password !== formData.repassword) {
      return toast.error("Mật khẩu xác nhận không khớp!");
    }

    setLoading(true);
    try {
      // CHÚ Ý: Kiểm tra lại đường dẫn API của bạn (có /api hay không)
      // Ví dụ: axios.post('/auth/register', formData)
      const { data } = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        repassword: formData.repassword
      });

      if (data.success) {
        toast.success(data.message || "Đăng ký thành công!");
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      // Hiển thị lỗi cụ thể từ Backend trả về
      const errorMsg = error.response?.data?.message || "Đăng ký thất bại";
      toast.error(errorMsg);
      console.error("Lỗi đăng ký:", error.response?.data);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(13,148,136,0.15)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-white/50">
        
        {/* LEFT SIDE: FORM */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center overflow-y-auto no-scrollbar">
          <div className="mb-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-teal-600 font-black italic text-xl uppercase tracking-tighter">
              <Store size={24} /> Smart Store
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">Tạo tài khoản</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Khám phá trải nghiệm mua sắm mới</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            {/* Họ tên */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Họ và tên</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600 transition-colors" size={16} />
                <input
                  type="text" name="name" required placeholder="Nguyen Van A"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-teal-500 focus:bg-white outline-none transition-all text-sm"
                  value={formData.name} onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600 transition-colors" size={16} />
                  <input
                    type="email" name="email" required placeholder="email@example.com"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-teal-500 focus:bg-white outline-none transition-all text-sm"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Số điện thoại</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600 transition-colors" size={16} />
                  <input
                    type="text" name="phone" placeholder="0901234567"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-teal-500 focus:bg-white outline-none transition-all text-sm"
                    value={formData.phone} onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Mật khẩu có con mắt */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600 transition-colors" size={16} />
                <input
                  type={showPass ? "text" : "password"}
                  name="password" required placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-teal-500 focus:bg-white outline-none transition-all text-sm"
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

            {/* Xác nhận mật khẩu có con mắt */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Xác nhận mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600 transition-colors" size={16} />
                <input
                  type={showRePass ? "text" : "password"}
                  name="repassword" required placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-teal-500 focus:bg-white outline-none transition-all text-sm"
                  value={formData.repassword} onChange={handleChange}
                />
                <button 
                  type="button"
                  onClick={() => setShowRePass(!showRePass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {showRePass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-900/10 transition-all active:scale-[0.98] mt-4 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <><span className="text-xs uppercase tracking-widest">Đăng ký ngay</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-teal-600 font-black hover:underline">Đăng nhập</Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: IMAGE */}
        <div className="hidden md:block md:w-1/2 p-3 bg-white">
          <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden group">
            <img src={userImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Register" />
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-lg font-black italic uppercase mb-1">Join the Future.</h3>
              <p className="text-white/70 text-[10px] leading-relaxed italic">"Nâng tầm phong cách sống thông minh cùng Smart Store."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterPage;