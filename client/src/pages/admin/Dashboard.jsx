import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowUpRight, 
  TrendingUp 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={24} />
      </div>
      <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
        {trend} <ArrowUpRight size={12} className="ml-1" />
      </span>
    </div>
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">Bảng điều khiển</h1>
        <p className="text-slate-400 text-sm font-medium">Chào mừng trở lại! Đây là những gì đang diễn ra hôm nay.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Doanh thu" value="128.450.000đ" icon={DollarSign} trend="+12%" color="bg-teal-500" />
        <StatCard title="Đơn hàng" value="456" icon={ShoppingBag} trend="+5%" color="bg-blue-500" />
        <StatCard title="Khách hàng" value="1,205" icon={Users} trend="+18%" color="bg-purple-500" />
        <StatCard title="Sản phẩm" value="85" icon={Package} trend="+2%" color="bg-orange-500" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder cho Biểu đồ */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 min-h-[400px] flex flex-col justify-center items-center">
           <TrendingUp size={48} className="text-slate-200 mb-4" />
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Biểu đồ tăng trưởng (Đang phát triển)</p>
        </div>

        {/* Danh sách hoạt động gần đây */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100">
          <h3 className="font-black text-slate-800 mb-6 uppercase text-xs tracking-widest">Đơn hàng mới nhất</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-xs">
                  #{i}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Nguyễn Văn A</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Vừa xong</p>
                </div>
                <div className="ml-auto text-sm font-black text-teal-600">
                  +520k
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;