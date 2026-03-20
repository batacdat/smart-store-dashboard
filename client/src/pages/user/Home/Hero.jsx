import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative h-[90vh] flex items-center overflow-hidden bg-gray-900">
      {/* Background Image với Overlay để làm nổi bật chữ */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80" 
          alt="Smart Store Hero" 
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-white">
        <div className="max-w-2xl animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Nâng Tầm Không Gian <br />
            <span className="text-orange-500">Sống Thông Minh</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Khám phá những sản phẩm công nghệ tiên tiến nhất, giúp tối ưu hóa hiệu suất làm việc và tận hưởng cuộc sống tiện nghi.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => document.getElementById('product').scrollIntoView({behavior: 'smooth'})}
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all transform hover:scale-105"
            >
              Mua Sắm Ngay
            </button>
            <Link 
              to="/about" 
              className="px-8 py-4 border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold rounded-lg transition-all"
            >
              Tìm Hiểu Thêm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;