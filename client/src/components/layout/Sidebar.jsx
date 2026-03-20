import React, { useState } from 'react';
import { 
  Home, ClipboardList, Package, Users, Compass, Wallet, 
  ChevronDown, ChevronRight, LogOut, Store, Menu, FileText, // Thêm FileText icon
  Settings,
  Clock,
  User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { FaAcquisitionsIncorporated } from 'react-icons/fa';

const MenuItem = ({ icon: Icon, title, to, isCollapsed, active, hasSubmenu, submenuOpen }) => {
  const location = useLocation();
  const isActive = active || (to && location.pathname === to);

  return (
    <div className={`
      flex items-center justify-between px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-all
      ${isActive ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}
      ${isCollapsed ? 'justify-center' : ''}
    `}>
      <div className="flex items-center gap-3">
        <Icon size={20} className={`${isActive ? 'opacity-100' : 'opacity-70'}`} />
        {!isCollapsed && <span className="text-sm font-bold">{title}</span>}
      </div>
      {!isCollapsed && hasSubmenu && (
        submenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
      )}
    </div>
  );
};

const SubMenuItem = ({ title, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`
      block py-2 pl-11 pr-4 text-xs font-bold rounded-lg transition-colors
      ${isActive ? 'text-teal-600 bg-teal-50/50' : 'text-slate-500 hover:text-teal-600 hover:bg-slate-50'}
    `}>
      {title}
    </Link>
  );
};

const Sidebar = ({ isCollapsed, setisCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  // Khởi tạo state cho submenu của blog
  const [submenuOpen, setSubmenuOpen] = useState({
    orders: false,
    products: false,
    blog: false,
    acount: false,
    settings: false
  });

  const toggleSubmenu = (menu) => {
    if(isCollapsed) {
      setisCollapsed(false);
    }
    setSubmenuOpen(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = () => {
    if(window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/system-gateway';
    }
  };


  const isGroupActive = (paths) => paths.some(path => location.pathname.startsWith(path));

  return (
     <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
      <div className={`
        fixed lg:relative bg-white h-screen border-r border-slate-100 flex flex-col p-4 z-50 transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'} 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* HEADER: LOGO & TOGGLE */}
        <div className={`flex items-center mb-10 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {/* Chỉ hiển thị Logo khi KHÔNG bị thu nhỏ (isCollapsed = false) */}
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="bg-teal-600 p-2 rounded-xl text-white"><Store size={22} /></div>
              <div>
                <h1 className="text-md font-black text-slate-800 leading-none">ChongThamBaoLinh</h1>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Admin</p>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => setisCollapsed(!isCollapsed)}
            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* MENU NAVIGATION */}
        <div className="flex-grow space-y-2 overflow-y-auto custom-scrollbar">
          <Link to="/admin/dashboard"><MenuItem icon={Home} title="Trang chủ" isCollapsed={isCollapsed} /></Link>

          {/*===================== Đơn hàng =============================== */}
          <div className="select-none">
            <div onClick={() => toggleSubmenu('orders')}>
              <MenuItem 
                icon={ClipboardList} title="Đơn hàng" 
                isCollapsed={isCollapsed} hasSubmenu submenuOpen={submenuOpen.orders}
                active={isGroupActive(['/admin/orders', '/admin/returns'])}
              />
            </div>
            {!isCollapsed && submenuOpen.orders && (
              <div className="space-y-1 mb-2 animate-in fade-in slide-in-from-top-1">
                <SubMenuItem title="Quản lý đơn hàng" to="/admin/orders" />
                <SubMenuItem title="Quản lý trả hàng" to="/admin/returns" />
              </div>
            )}
          </div>

          {/*===================== Sản phẩm =============================== */}
          <div className="select-none">
            <div onClick={() => toggleSubmenu('products')}>
              <MenuItem 
                icon={Package} title="Sản phẩm" 
                isCollapsed={isCollapsed} hasSubmenu submenuOpen={submenuOpen.products}
                active={isGroupActive(['/admin/products', '/admin/add-product'])}
              />
            </div>
            {!isCollapsed && submenuOpen.products && (
              <div className="space-y-1 mb-2 animate-in fade-in slide-in-from-top-1">
                <SubMenuItem title="Quản lý sản phẩm" to="/admin/products" />
                <SubMenuItem title="Thêm sản phẩm" to="/admin/add-product" />
              </div>
            )}
          </div>
          {/*===================== Bài viết =============================== */}
          <div className="select-none">
          <div onClick={() => toggleSubmenu('blog')}>
            <MenuItem 
              icon={FileText} title="Bài viết" 
              isCollapsed={isCollapsed} hasSubmenu submenuOpen={submenuOpen.blog}
              active={isGroupActive(['/admin/blog'])} // Active nếu đường dẫn bắt đầu bằng /admin/blog
            />
          </div>
          {!isCollapsed && submenuOpen.blog && (
            <div className="space-y-1 mb-2 animate-in fade-in slide-in-from-top-1">
              <SubMenuItem title="Quản lý bài viết" to="/admin/blog" />
              <SubMenuItem title="Thêm bài viết" to="/admin/blog/create" />
            </div>
          )}
        </div>
        {/*===================== Tài khoản =============================== */}
       <div className="select-none">
          <div onClick={() => toggleSubmenu('acount')}>
            <MenuItem 
              icon={User} title="Tài khoản" 
              isCollapsed={isCollapsed} hasSubmenu submenuOpen={submenuOpen.acount}
              active={isGroupActive(['/admin/acount'])} // Active nếu đường dẫn bắt đầu bằng /admin/acount
            />
          </div>
          {!isCollapsed && submenuOpen.acount && (
            <div className="space-y-1 mb-2 animate-in fade-in slide-in-from-top-1">
              <SubMenuItem title="Quản lý tài khoản" to="/admin/acount" />
              <SubMenuItem title="Thêm tài khoản Admin" to="/admin/createAdmin" />
            </div>
          )}
        </div>
                
                {/*===================== Cài đặt =============================== */}
        <div className="select-none border-t border-slate-50 mt-2 pt-2">
          <div onClick={() => toggleSubmenu('settings')}>
            <MenuItem
              icon={Settings} title="Cài đặt"
              isCollapsed={isCollapsed} hasSubmenu submenuOpen={submenuOpen.settings}
              active={isGroupActive(['/admin/settings', '/admin/change-password'])}
            />
          </div>
          {!isCollapsed && submenuOpen.settings && (
            <div className="space-y-1 mb-2 animate-in fade-in slide-in-from-top-1">
              <SubMenuItem title="Đổi mật khẩu" to="/admin/change-password" />
              <SubMenuItem title="Đăng xuất" onClick={handleLogout} />
            </div>
          )}
        </div>

        
        
        </div>

        {/* FOOTER */}
      {/* FOOTER (ĐÃ BỎ ICON ĐĂNG XUẤT) */}
        <div className="mt-auto pt-4 border-t border-slate-100 p-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                  AD
              </div>
              <div className="text-sm font-bold text-slate-800 flex-grow">Administrator</div>
            </div>
          )}
        </div>

      </div>
    </>

  );
};

export default Sidebar;