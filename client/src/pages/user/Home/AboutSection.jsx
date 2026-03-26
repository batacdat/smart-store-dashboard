import React from 'react';
import { CheckCircle2, Trophy, Users, Lightbulb } from 'lucide-react';
// Bạn có thể thay ảnh này bằng ảnh thực tế của văn phòng hoặc đội ngũ Bảo Linh
import ABOUT_IMAGE from "../../../assets/about.jpg";

const AboutSection = () => {
  const stats = [
    { icon: <Trophy className="text-orange-500" />, label: "Năm kinh nghiệm", value: "10+" },
    { icon: <Users className="text-orange-500" />, label: "Khách hàng tin dùng", value: "5000+" },
    { icon: <CheckCircle2 className="text-orange-500" />, label: "Công trình hoàn thành", value: "1200+" },
    { icon: <Lightbulb className="text-orange-500" />, label: "Giải pháp sáng tạo", value: "100%" },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Bên trái: Hình ảnh minh họa */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-orange-100 rounded-2xl transform -rotate-3 group-hover:rotate-0 transition duration-500"></div>
          <img 
            src={ABOUT_IMAGE} 
            alt="Về Bảo Linh SMART-STORE" 
            className="relative rounded-xl shadow-2xl w-full h-[400px] object-cover"
          />
          {/* Badge trải nghiệm nhanh */}
          <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl hidden md:block animate-bounce-slow">
            <p className="text-4xl font-bold text-orange-600">10+</p>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Năm đồng hành</p>
          </div>
        </div>

        {/* Bên phải: Nội dung văn bản */}
        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 bg-orange-50 rounded-full">
            <span className="text-orange-600 text-sm font-bold uppercase tracking-widest">Về chúng tôi</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Bảo Linh - Kiến Tạo Giải Pháp <br />
            <span className="text-orange-600">Chống Thấm Hiệu Quả</span>
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed">
            Tại <strong>Bảo Linh</strong>, chúng tôi không chỉ cung cấp vật liệu chống thấm, chúng tôi còn mang đến giải pháp chống thấm hoàn toàn mới. Với hơn 10 năm kinh nghiệm, chúng tôi tự hào là đơn vị tiên phong trong việc tích hợp công nghệ vào không gian sống và làm việc.
          </p>

          {/* Danh sách đặc điểm nổi bật */}
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="p-1 bg-green-100 rounded-full text-green-600"><CheckCircle2 size={18} /></div>
              Sản phẩm chính hãng, kiểm định nghiêm ngặt.
            </li>
            <li className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="p-1 bg-green-100 rounded-full text-green-600"><CheckCircle2 size={18} /></div>
              Giải pháp tối ưu hóa theo nhu cầu riêng biệt.
            </li>
            <li className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="p-1 bg-green-100 rounded-full text-green-600"><CheckCircle2 size={18} /></div>
              Hỗ trợ kỹ thuật 24/7 tận tình, chuyên nghiệp.
            </li>
          </ul>

          <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200">
            Xem hồ sơ năng lực
          </button>
        </div>
      </div>

      {/* Phần con số thống kê (Stats) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 py-12 border-t border-slate-100 bg-orange-50 rounded-xl w-full">
        {stats.map((stat, index) => (
          <div key={index} className="text-center space-y-2 group cursor-default">
            <div className="flex justify-center text-3xl transition-transform group-hover:scale-110 duration-300">
              {stat.icon}
            </div>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-tighter">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutSection;