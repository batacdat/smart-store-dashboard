import React from 'react';
import { Helmet } from 'react-helmet-async'; // Tối ưu SEO cho từng trang
import Hero from './Hero';
import AboutSection from './AboutSection';
import ProductSection from './ProductSection';
import BlogSection from './BlogSection';
import ContactSection from './ContactSection';

const HomePage = () => {
  return (
    <>
      {/* Tối ưu SEO: Giúp Google hiểu nội dung trang chủ */}
      <Helmet>
        <title>ChongThamBaoLinh - Giải pháp chống thấm hiện đại dẫn đầu xu hướng</title>
        <meta name="description" content="Khám phá bộ sưu tập thiết kế thông minh, sản phẩm chống thấm hiệu quả và tin tức mới nhất tại ChongThamBaoLinh." />
        <meta property="og:title" content="ChongThamBaoLinh - Giải pháp chống thấm hiện đại" />
      </Helmet>

      <div className="flex flex-col">
        {/* Mỗi Section cần có ID tương ứng với Header để cuộn mượt (Smooth Scroll) */}
        
        <section id="hero">
          <Hero />
        </section>

        <section id="about" className="py-20 bg-gray-50">
          <AboutSection />
        </section>

        <section id="product" className="py-20">
          <ProductSection />
        </section>

        <section id="blog" className="py-20 bg-gray-50">
          <BlogSection />
        </section>

        <section id="contact" className="py-20">
          <ContactSection />
        </section>
      </div>
    </>
  );
};

export default HomePage;