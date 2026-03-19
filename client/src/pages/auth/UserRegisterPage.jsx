import React, { useState } from 'react';
import { Lock, User, Phone, ArrowRight, Loader2, Store, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import userImage from '../../assets/shopping.jpg';

const UserRegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    repassword: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) return toast.error("Mật khẩu ít nhất 6 ký tự");
    if (formData.password !== formData.repassword) return toast.error("Mật khẩu không khớp!");

    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', formData); 
      if (data.success) {
        toast.success("Đăng ký thành công!");
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row border border-white/50">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 text-indigo-600 font-black italic text-xl uppercase tracking-tighter">
              <Store size={24} /> ChongThamBaoLinh
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Tạo tài khoản</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Đăng ký bằng số điện thoại</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Họ và tên</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" name="name" required placeholder="Nguyen Van A" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm" value={formData.name} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Số điện thoại</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" name="phone" required placeholder="0901234567" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type={showPass ? "text" : "password"} name="password" required placeholder="••••••••" className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm" value={formData.password} onChange={handleChange} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nhập lại mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type={showRePass ? "text" : "password"} name="repassword" required placeholder="••••••••" className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm" value={formData.repassword} onChange={handleChange} />
                <button type="button" onClick={() => setShowRePass(!showRePass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showRePass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4 transition-all">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><span className="text-xs uppercase tracking-widest">Đăng ký ngay</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Đã có tài khoản? <Link to="/login" className="text-indigo-600 font-black hover:underline">Đăng nhập</Link></p>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 p-3 bg-white">
          <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden group">
            <img src={userImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Register" />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterPage;