import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white uppercase">chongthambaolinh</h2>
            <p className="text-sm leading-relaxed">
              Chúng tôi cung cấp những giải pháp công nghệ hiện đại nhất, giúp nâng tầm cuộc sống của bạn qua từng sản phẩm chất lượng.
            </p>
            <div className="flex space-x-4 text-xl">
              <a href="#" className="hover:text-orange-500 transition"><FaFacebook /></a>
              <a href="https://www.tiktok.com/@xaydunghanoi88.vn" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition"><FaTiktok /></a>
              <a href="#" className="hover:text-orange-500 transition"><FaTwitter /></a>
              <a href="https://www.youtube.com/@khavu3707" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition"><FaYoutube /></a>
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh (Tối ưu SEO Internal Link) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-orange-500 transition">Trang chủ</Link></li>
              <li><a href="/#about" className="hover:text-orange-500 transition">Về chúng tôi</a></li>
              <li><a href="/#product" className="hover:text-orange-500 transition">Sản phẩm nổi bật</a></li>
              <li><Link to="/blog" className="hover:text-orange-500 transition">Tin tức công nghệ</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-500 transition">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Câu hỏi thường gặp (FAQ)</a></li>
              <li><a href="/#contact" className="hover:text-orange-500 transition">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>

          {/* Cột 4: Thông tin liên hệ trực tiếp */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 text-orange-500" />
                <span>188 Nguyễn Xiển, Thanh Xuân, Hà Nội</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhoneAlt className="text-orange-500" />
                <span>+84 903 232 492</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-orange-500" />
                <span>support@baolinh.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 mb-6" />

        {/* Bản quyền và Pháp lý */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0">
          <p>© {currentYear} CHONGTHAMBAOLINH. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;