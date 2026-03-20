import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Chúng ta sẽ tạo Header ở bước sau
import Footer from './Footer';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header cố định ở trên cùng */}
      <Header />

      {/* Phần nội dung thay đổi tùy theo Route (Home, Product Detail, Blog...) */}
      <main className="min-h-screen pt-20"> {/* pt-20 để không bị Header đè mất nội dung */}
        <Outlet />
      </main>

      {/* Footer ở dưới cùng */}
      <Footer />
    </div>
  );
};

export default UserLayout;