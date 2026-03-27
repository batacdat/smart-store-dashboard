import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import axios from '../../api/axios'; // Đảm bảo đường dẫn này đúng với project của bạn
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, color, textColor }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} ${textColor}`}>
        <Icon size={24} />
      </div>
      <span className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">
        +12% <ArrowUpRight size={12} className="ml-1" />
      </span>
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-slate-800 mt-1">
        {typeof value === 'number' && title.includes('DOANH THU') 
          ? value.toLocaleString('vi-VN') + 'đ' 
          : value}
      </h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy thống kê từ hàm getOrderStats trong Controller
  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/orders/admin/stats');
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Lỗi fetch stats:", error);
      toast.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc]">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Đang đồng bộ dữ liệu...</p>
    </div>
  );

  return (
    <div className="p-8 w-full bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Bảng điều khiển</h1>
        <p className="text-slate-500 text-sm font-medium">Chào mừng trở lại! Đây là tình hình kinh doanh hôm nay.</p>
      </div>

      {/* Grid Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Tổng doanh thu" 
          value={stats?.totalRevenue || 0} 
          icon={DollarSign} 
          color="bg-indigo-50" 
          textColor="text-indigo-600"
        />
        <StatCard 
          title="Tổng đơn hàng" 
          value={stats?.totalOrders || 0} 
          icon={ShoppingBag} 
          color="bg-blue-50" 
          textColor="text-blue-600"
        />
        <StatCard 
          title="Chờ xác nhận" 
          value={stats?.pendingOrders || 0} 
          icon={Clock} 
          color="bg-orange-50" 
          textColor="text-orange-600"
        />
        <StatCard 
          title="Đã hoàn thành" 
          value={stats?.deliveredOrders || 0} 
          icon={CheckCircle} 
          color="bg-emerald-50" 
          textColor="text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biểu đồ giả lập dựa trên dữ liệu thật */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 min-h-[400px] flex flex-col relative overflow-hidden">
           <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Phân tích trạng thái</h3>
                <p className="text-slate-400 text-[10px] mt-1 uppercase font-bold">Dữ liệu thời gian thực</p>
              </div>
              <TrendingUp className="text-indigo-600" />
           </div>

           {/* Thanh trạng thái trực quan */}
           <div className="space-y-6 mt-4">
              <StatusProgress label="Đang giao hàng" count={stats?.shippingOrders} total={stats?.totalOrders} color="bg-blue-500" />
              <StatusProgress label="Đang xử lý" count={stats?.processingOrders} total={stats?.totalOrders} color="bg-indigo-500" />
              <StatusProgress label="Đã hủy" count={stats?.cancelledOrders} total={stats?.totalOrders} color="bg-rose-500" />
           </div>

           <div className="mt-auto pt-8 flex items-center justify-center border-t border-slate-50">
             <p className="text-slate-300 font-bold uppercase tracking-[0.3em] text-[9px]">Tỷ lệ hoàn thành đơn: {((stats?.deliveredOrders / stats?.totalOrders) * 100 || 0).toFixed(1)}%</p>
           </div>
        </div>

        {/* Cột phải: Tóm tắt nhanh */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
          <h3 className="font-black text-white mb-8 uppercase text-xs tracking-[0.2em]">Tình trạng vận hành</h3>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-orange-400"><Clock size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase">Đơn mới</p>
                  <p className="text-lg font-black">{stats?.pendingOrders}</p>
                </div>
              </div>
              <XCircle className="text-white/10" size={24} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400"><CheckCircle size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase">Thành công</p>
                  <p className="text-lg font-black">{stats?.deliveredOrders}</p>
                </div>
              </div>
              <XCircle className="text-white/10" size={24} />
            </div>
            
            <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Lời khuyên hệ thống</p>
              <p className="text-xs text-white/70 leading-relaxed italic">
                {stats?.pendingOrders > 5 
                  ? "Có khá nhiều đơn hàng chưa xác nhận. Hãy xử lý ngay để giữ chân khách hàng!"
                  : "Hệ thống đang hoạt động ổn định. Tuyệt vời!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component phụ cho thanh tiến trình
const StatusProgress = ({ label, count, total, color }) => {
  const percentage = (count / total) * 100 || 0;
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-black text-slate-900">{count} đơn</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default Dashboard;