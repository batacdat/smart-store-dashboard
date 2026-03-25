import React from 'react';
import { ShoppingCart, ArrowRight, CheckCircle, Droplets, MapPin } from 'lucide-react';

// BƯỚC 1: Import ảnh banner từ thư mục assets
// Đảm bảo đường dẫn này chính xác với cấu trúc thư mục của bạn
import heroBannerImage from "../../../assets/ô_che_nhà.png"; 
import { useNavigate } from 'react-router-dom';

const Hero = () => {

    const navigate = useNavigate();
    const handleNavClick = (e, targetId) => {
    e.preventDefault();
   
    if (location.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${targetId}`);
    }
  };
  return (
    // THAY ĐỔI: Chuyển sang bố cục Banner toàn màn hình
    <section className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden ">
      
      {/* 1. LỚP NỀN HÌNH ẢNH (BACKGROUND IMAGE) */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img 
          src={heroBannerImage} 
          alt="Bảo Linh Tech - Giải pháp chống thấm chuyên nghiệp" 
          className="w-full h-full object-cover object-center"
        />
        {/* Lớp phủ màu cam mờ (Overlay) để làm nổi bật chữ trắng */}
        <div className="absolute inset-0  backdrop-blur-[2px]"></div>
      </div>

      {/* 2. LỚP NỘI DUNG CHỮ (CONTENT OVERLAY) */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-white">
        {/* Căn chỉnh nội dung ra giữa hoặc sang trái tùy thích. Ở đây tôi căn giữa để trông cân đối */}
        <div className="max-w-4xl mx-auto text-center space-y-10">
          
          {/* Nhãn giới thiệu */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/10 text-white text-xs font-black uppercase tracking-[0.25em] rounded-full border border-white/20 backdrop-blur-sm">
              <Droplets size={16} className="text-white" />
              Hệ thống chống thấm toàn diện
            </span>
          </div>

          {/* Tiêu đề lớn (Heading) */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-wider">
            Bảo vệ công trình <br/>
            bền vững <span className="text-orange-400">trước mọi cơn mưa</span>
          </h1>

          {/* Đoạn mô tả ngắn */}
          <p className="text-white text-xl leading-relaxed font-medium max-w-2xl mx-auto opacity-90">
            Khám phá các giải pháp chống thấm chất lượng cao: từ màng chống thấm, 
            keo chống thấm chuyên dụng. CHONGTHAMBAOLINH - đối tác tin cậy
            cho mọi công trình bền vững.
          </p>

          {/* Các nút kêu gọi hành động (CTA Buttons) */}
          <div className="flex items-center justify-center gap-6 pt-6">
            <button href="#product" onClick={(e) => handleNavClick(e, 'product')} className="px-10 py-5 bg-white text-orange-600 font-black rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-orange-950/20 active:scale-95 uppercase text-sm tracking-widest flex items-center gap-3">
              <ShoppingCart size={20} />
              Mua ngay sản phẩm
            </button>
            <button href="#about" onClick={(e) => handleNavClick(e, 'about')} className="px-10 py-5 bg-transparent text-white font-black rounded-2xl hover:bg-white/10 transition-all text-sm flex items-center gap-2 group border border-white/30">
               Tìm hiểu thêm
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Hiển thị địa chỉ mờ mờ ở góc dưới cho uy tín (Tuỳ chọn) */}
          <div className="flex justify-center gap-2 items-center text-xs text-orange-100/70 pt-8">
              <MapPin size={14} />
              <span>Phân phối toàn quốc</span>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;