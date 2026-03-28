import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Truck, CheckCircle2, XCircle, 
  MapPin, Phone, User, Calendar, CreditCard, ClipboardList, 
  Loader2, BadgeCheck, AlertCircle, Clock, Printer 
} from 'lucide-react';
import axios from '../../../api/axios';
import toast from 'react-hot-toast';
import InvoiceTemplate from './InvoiceTemplate';
import { useSocketEvents } from '../../../hooks/useSocketEvents'; // Import socket hook

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printTimeoutRef = useRef(null);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [paymentUpdating, setPaymentUpdating] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const statusOptions = ['Chờ xác nhận', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'];

  const fetchOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/orders/${id}`);
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      toast.error("Lỗi tải dữ liệu");
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) fetchOrderDetail();
    
    // Cleanup timeout khi unmount
    return () => {
      if (printTimeoutRef.current) {
        clearTimeout(printTimeoutRef.current);
      }
    };
  }, [id, fetchOrderDetail]);

  // Socket events for real-time updates
  const socketEvents = {
    'order-status-updated': (data) => {
      // Chỉ cập nhật nếu đây là đơn hàng hiện tại
      if (data.orderId === id) {
       
        setOrder(prevOrder => ({
          ...prevOrder,
          status: data.newStatus,
          ...data.order
        }));
        toast.success(`Đơn hàng đã được cập nhật sang trạng thái: ${data.newStatus}`, {
          duration: 3000,
          position: 'top-right'
        });
      }
    },
    
    'payment-status-updated': (data) => {
      // Chỉ cập nhật nếu đây là đơn hàng hiện tại
      if (data.orderId === id) {
        //('Nhận cập nhật thanh toán realtime:', data);
        setOrder(prevOrder => ({
          ...prevOrder,
          paymentStatus: data.newPaymentStatus,
          paymentInfo: data.paymentInfo,
          ...data.order
        }));
        toast.success(`Thanh toán đã được cập nhật: ${data.newPaymentStatus}`, {
          duration: 3000,
          position: 'top-right'
        });
      }
    }
  };

  // Sử dụng socket hook
  useSocketEvents(socketEvents, [id]);

  const handlePrint = () => {
    if (isPrinting) return;
    
    setIsPrinting(true);
    
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      try {
        window.print();
      } catch (error) {
        console.error('Print error:', error);
        toast.error('Có lỗi khi in hóa đơn');
      } finally {
        document.body.style.overflow = originalOverflow;
        
        printTimeoutRef.current = setTimeout(() => {
          setIsPrinting(false);
        }, 1000);
      }
    }, 200);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === order.status) return;
    
    setUpdating(true);
    try {
      const { data } = await axios.put(`/orders/${id}/status`, { status: newStatus });
      if (data.success) {
        toast.success(`Đã cập nhật trạng thái: ${newStatus}`);
        setOrder(data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmPayment = async () => {
    setIsPaymentModalOpen(false);
    setPaymentUpdating(true);
    try {
      const { data } = await axios.put(`/orders/${id}/payment`, { 
        paymentStatus: 'Đã thanh toán',
        paymentInfo: { method: order.paymentMethod, paidAt: new Date() }
      });
      if (data.success) {
        toast.success("Đã xác nhận thanh toán");
        setOrder(data.data);
      }
    } catch (error) {
      toast.error("Lỗi cập nhật thanh toán");
    } finally {
      setPaymentUpdating(false);
    }
  };

  const isStatusChangeable = (status) => {
    if (order.status === 'Đã hủy' || order.status === 'Đã giao') return false;
    return true;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto no-print">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-all"
          >
            <ArrowLeft size={16} /> Quay lại
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              disabled={isPrinting}
              className={`flex items-center gap-2 px-6 py-3 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${
                isPrinting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-slate-800 hover:bg-black'
              }`}
            >
              {isPrinting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Printer size={16} />
              )}
              {isPrinting ? 'Đang xử lý...' : 'In hóa đơn A5'}
            </button>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight ml-4">
              Đơn hàng #{order.orderCode}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: DỮ LIỆU SẢN PHẨM */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Package size={20} /></div>
                <h2 className="font-black text-slate-900 uppercase text-sm tracking-tight">Sản phẩm chi tiết</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {order.products?.map((item, index) => (
                  <div key={item.product?._id || index} className="py-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                        {item.product?.images?.[0]?.url ? (
                          <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="text-slate-200" size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                        <p className="text-xs text-slate-400 font-medium tracking-tight">
                          x{item.quantity} • {item.price.toLocaleString()}đ 
                          <span className="ml-2 text-indigo-500 font-bold">(Kho: {item.product?.stock || 0})</span>
                        </p>
                      </div>
                    </div>
                    <p className="font-black text-slate-900 text-sm">{(item.price * item.quantity).toLocaleString()}đ</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 space-y-3 font-bold uppercase text-[10px] tracking-widest text-slate-400">
                <div className="flex justify-between text-indigo-600 text-xl font-black pt-2">
                  <span>Tổng cộng</span>
                  <span>{order.totalAmount?.toLocaleString()}đ</span>
                </div>
              </div>
            </div>

            {/* BOX THANH TOÁN */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><CreditCard size={20} /></div>
                  <h2 className="font-black text-slate-900 uppercase text-sm tracking-tight">Thanh toán</h2>
                </div>
                {order.paymentStatus !== 'Đã thanh toán' && order.status !== 'Đã hủy' && (
                  <button 
                    onClick={() => setIsPaymentModalOpen(true)} 
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2"
                    disabled={paymentUpdating}
                  >
                    {paymentUpdating ? <Loader2 size={14} className="animate-spin" /> : <BadgeCheck size={14} />}
                    {paymentUpdating ? 'Đang xử lý...' : 'Xác nhận tiền'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl italic text-sm">
                <p>Phương thức: <b>{order.paymentMethod}</b></p>
                <p>Trạng thái: <b className={order.paymentStatus === 'Đã thanh toán' ? 'text-emerald-600' : 'text-rose-500'}>{order.paymentStatus}</b></p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: XỬ LÝ VẬN CHUYỂN */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2rem] shadow-xl p-8 text-white">
              <h2 className="font-black uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2">
                <ClipboardList size={16} /> Quy trình xử lý
              </h2>
              <div className="space-y-3">
                {statusOptions.map((status) => {
                  const isActive = order.status === status;
                  const isDisabled = updating || isActive || !isStatusChangeable(status);
                  
                  return (
                    <button
                      key={status}
                      disabled={isDisabled}
                      onClick={() => handleUpdateStatus(status)}
                      className={`w-full py-3.5 px-5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-between border ${
                        isActive 
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' 
                          : isDisabled
                          ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                          : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {status} 
                      {isActive && <CheckCircle2 size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
              <h2 className="font-black text-slate-900 uppercase text-xs mb-6 flex items-center gap-2 tracking-widest">
                <MapPin size={16} className="text-orange-500" /> Địa chỉ giao hàng
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">{order.shippingInfo?.fullName}</p>
                    <p className="text-xs text-slate-500 font-bold">{order.shippingInfo?.phone}</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl italic text-xs leading-relaxed text-slate-600">
                  {order.shippingInfo?.address}
                </div>
                {order.shippingInfo?.note && (
                  <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-700">
                    📝 Ghi chú: {order.shippingInfo.note}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component hóa đơn riêng biệt - chỉ render khi có order */}
      {order && <InvoiceTemplate order={order} />}

      {/* MODAL THANH TOÁN */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPaymentModalOpen(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <BadgeCheck size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase mb-2">Xác nhận thanh toán</h3>
              <p className="text-slate-500 text-sm mb-8">
                Bạn chắc chắn đơn hàng <span className="font-bold">#{order.orderCode}</span> đã nhận đủ tiền?
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setIsPaymentModalOpen(false)} 
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleConfirmPayment} 
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  disabled={paymentUpdating}
                >
                  {paymentUpdating && <Loader2 size={14} className="animate-spin" />}
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetail;