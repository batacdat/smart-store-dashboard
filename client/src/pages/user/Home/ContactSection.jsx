import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import axios from '../../../api/axios';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const ContactSection = () => {
    const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi API đến Backend của bạn
      const response = await axios.post('/contact', formData);
      
      if (response.data.success) {
        toast.success("Cảm ơn bạn! Tin nhắn đã được gửi đến muinv2512@gmail.com");
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi gửi tin nhắn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Tiêu đề */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-600 font-bold uppercase tracking-widest text-sm italic">Liên hệ với chúng tôi</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3 mb-6 ">Bạn cần hỗ trợ? Hãy gửi lời nhắn cho Bảo Linh</h2>
          <p className="text-slate-500 text-md md:text-lg">Đội ngũ kỹ thuật của chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về giải pháp công nghệ.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
          <div className="w-full lg:w-5/12 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              
              {/* Địa chỉ */}
              <div className="flex items-start gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-hover hover:shadow-xl hover:shadow-slate-200/50 duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-md md:text-lg lg:text-xl mb-1">Địa chỉ trụ sở</h4>
                  <p className="text-slate-500 leading-relaxed text-md md:text-lg lg:text-xl">188 Nguyễn Xiển, Thanh Xuân, Hà Nội</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-hover hover:shadow-xl hover:shadow-slate-200/50 duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-md md:text-lg lg:text-xl mb-1">Email hỗ trợ</h4>
                  <p className="text-slate-500 text-md md:text-lg lg:text-xl">support@baolinh.com</p>
                  <p className="text-slate-500 text-md md:text-lg lg:text-xl">info@baolinh.com</p>
                </div>
              </div>

              {/* Điện thoại */}
              <div className="flex items-start gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-hover hover:shadow-xl hover:shadow-slate-200/50 duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-md md:text-lg lg:text-xl mb-1">Liên hệ</h4>
                  <p className="text-slate-500 font-bold text-md md:text-lg lg:text-xl">0903 232 492 <br/> 0989 690 256</p>
                  <p className="text-slate-400 text-sm italic">Hỗ trợ 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM LIÊN HỆ */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-50 relative overflow-hidden">
              {/* Trang trí góc form */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-3xl"></div>
              
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Họ và tên</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Địa chỉ Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Chủ đề</label>
                  <input 
                    type="text" 
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Bạn đang quan tâm đến vấn đề gì?" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Nội dung tin nhắn</label>
                  <textarea 
                    rows="5" 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mô tả chi tiết yêu cầu của bạn..." 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-orange-700 disabled:bg-slate-400 transition-all shadow-xl"
                >
                {loading ? (
                    <>Đang gửi... <Loader2 className="animate-spin" size={20} /></>
                ) : (
                    <>Gửi lời nhắn ngay <Send size={20} /></>
                )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;