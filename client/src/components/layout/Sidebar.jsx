import React, { useState } from 'react';
import { 
  Home, ClipboardList, Package, Users, Compass, Wallet, 
  ChevronDown, ChevronRight, LogOut, Store, Menu 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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

const SubMenuItem = ({ title, to, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`
      flex items-center gap-2 pl-12 pr-4 py-2 rounded-lg text-sm transition-all
      ${isActive ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-800'}
      ${isCollapsed ? 'hidden' : 'flex'} 
    `}>
      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-teal-600' : 'bg-slate-300'}`} />
      {title}
    </Link>
  );
};

const Sidebar = ({ isCollapsed, setisCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const [submenuOpen, setSubmenuOpen] = useState({ orders: false, products: false });
  const location = useLocation();

  const toggleSubmenu = (menu) => {
    if (isCollapsed) {
      setisCollapsed(false); // Mở rộng sidebar nếu đang đóng mà bấm vào menu có con
    }
    setSubmenuOpen(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isGroupActive = (paths) => paths.some(path => location.pathname === path);

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
                <h1 className="text-lg font-black text-slate-800 leading-none">Smart Store</h1>
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

          {/* Đơn hàng */}
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

          {/* Sản phẩm */}
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

          <Link to="/admin/users"><MenuItem icon={Users} title="Khách hàng" isCollapsed={isCollapsed} /></Link>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-3">
          {!isCollapsed && <div className="text-sm font-bold text-slate-800 flex-grow">Admin</div>}
          <button className="text-slate-400 hover:text-red-500 p-2"><LogOut size={18} /></button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;