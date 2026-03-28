import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Search, Filter, Calendar, Package, ChevronRight, Loader2, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import toast from 'react-hot-toast';
import { useSocketEvents } from '../../../hooks/useSocketEvents'; // Import socket hook

const AdminOrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  const statusTabs = ['Tất cả', 'Chờ xác nhận', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'];
const alertSound = useMemo(() => new Audio('/sounds/notification.mp3'), []);
  // Fetch dữ liệu từ API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/orders/admin/orders');
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Socket events for real-time updates
  const socketEvents = {
    'new-order-admin': (data) => {
      
      // 1. Phát âm thanh
      alertSound.currentTime = 0; // Chơi lại từ đầu nếu có nhiều đơn liên tiếp
      alertSound.play().catch(err => {
        err.message("Âm thanh bị chặn bởi trình duyệt. Admin cần click vào trang web trước.");
      });

      toast.success(`${data.customer} vừa đặt đơn hàng ${data.orderCode}`, {
        duration: 5000,
        position: 'top-right',
        icon: '🛒'
      });
      
      // Phát âm thanh thông báo (nếu muốn)
      try {
        const audio = new Audio('/sounds/notification1.wav');
        audio.play().catch(e => console.log('Audio play failed:', e));
      } catch (error) {
        console.log('Audio not supported');
      }
      
      // Thêm đơn hàng mới vào đầu danh sách
      if (data.order) {
        setOrders(prevOrders => [data.order, ...prevOrders]);
      } else {
        // Nếu không có order data, fetch lại
        fetchOrders();
      }
    },
    
    'order-status-updated': (data) => {
     
      
      // Cập nhật trạng thái trong danh sách
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.orderId 
            ? { ...order, status: data.newStatus, ...data.order }
            : order
        )
      );
      
      toast.info(`Đơn hàng ${data.orderCode} đã chuyển sang trạng thái: ${data.newStatus}`, {
        duration: 3000,
        position: 'top-right'
      });
    },
    
    'payment-status-updated': (data) => {
  
      
      // Cập nhật trạng thái thanh toán trong danh sách
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.orderId 
            ? { ...order, paymentStatus: data.newPaymentStatus, ...data.order }
            : order
        )
      );
      
      toast.success(`Đơn hàng ${data.orderCode} đã cập nhật thanh toán: ${data.newPaymentStatus}`, {
        duration: 3000,
        position: 'top-right'
      });
    },
    
    'order-cancelled-by-user': (data) => {
   
      // Cập nhật trạng thái trong danh sách
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.orderId 
            ? { ...order, status: 'Đã hủy', cancelledReason: data.cancelledReason, ...data.order }
            : order
        )
      );
      
      toast.error(`Đơn hàng ${data.orderCode} đã bị hủy bởi khách hàng ${data.customer}`, {
        duration: 5000,
        position: 'top-right'
      });
    }
  };

  // Sử dụng socket hook
  useSocketEvents(socketEvents, []);

  // Logic Lọc và Tìm kiếm
  const filteredOrders = orders.filter(order => {
    const matchesStatus = activeTab === 'Tất cả' || order.status === activeTab;
    const matchesSearch = 
        order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingInfo?.phone?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Hàm định dạng màu sắc cho Status
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã giao': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Chờ xác nhận': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Đang giao': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Đã hủy': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <Package className="text-indigo-600" size={28} />
            Quản lý đơn hàng
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Quản lý và theo dõi quy trình xử lý đơn hàng hệ thống</p>
        </div>
        
        <button 
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* TABS & SEARCH */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-2 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
              {statusTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Tìm mã đơn, tên, SĐT..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <Loader2 className="animate-spin" size={40} />
              <span className="font-bold text-xs uppercase tracking-[0.2em]">Đang tải dữ liệu...</span>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Đơn hàng</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Khách hàng</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Ngày đặt</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tổng tiền</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Trạng thái</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <span className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors capitalize">
                          #{order.orderCode}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">{order.shippingInfo?.fullName}</span>
                          <span className="text-xs text-slate-400 font-medium">{order.shippingInfo?.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center">
                           <span className="text-slate-600 font-bold text-xs italic">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-black text-indigo-600">
                          {order.totalAmount?.toLocaleString()}đ
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95"
                        >
                          Chi tiết
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Package size={48} strokeWidth={1} />
              <p className="font-bold text-xs uppercase tracking-widest">Không tìm thấy đơn hàng nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManagement;