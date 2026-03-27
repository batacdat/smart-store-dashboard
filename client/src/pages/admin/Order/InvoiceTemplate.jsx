import React from 'react';

const InvoiceTemplate = ({ order }) => {
  if (!order) return null;

  return (
    <div id="invoice-print" className="hidden print:block bg-white text-slate-900 w-full">
      {/* Vẫn giữ Style này để ép khổ giấy A5 ngang */}
      <style>{`
        @media print {
          @page { size: A5 landscape; margin: 5mm; }
          body * { visibility: hidden; }
          #invoice-print, #invoice-print * { visibility: visible; }
          #invoice-print { 
            position: absolute; 
            left: 0; top: 0; width: 100%; 
            display: block !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-black pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Hóa Đơn</h1>
          <p className="text-xs font-bold mt-1">Mã đơn: #{order.orderCode}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-black uppercase text-indigo-700">chongthambaolinh</h2>
          <p className="text-[10px] italic">Hotline: 0903 2324 92</p>
            <p className="text-[10px] italic">Địa chỉ: 188 Nguyễn Xiển, Thanh Xuân, Hà Nội</p>
        </div>
      </div>

      {/* Thông tin khách & Thanh toán */}
      <div className="grid grid-cols-2 gap-6 my-6">
        <div className="border border-slate-200 p-3 rounded-xl">
          <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Khách nhận:</p>
          <p className="text-sm font-black">{order.shippingInfo.fullName}</p>
          <p className="text-xs">{order.shippingInfo.phone}</p>
          <p className="text-xs italic leading-tight">{order.shippingInfo.address}</p>
        </div>
        <div className="border border-slate-200 p-3 rounded-xl">
          <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Thanh toán:</p>
          <p className="text-xs font-medium">Phương thức: <b className="font-black">{order.paymentMethod}</b></p>
          <p className="text-xs font-medium">Trạng thái: <b className="font-black">{order.paymentStatus}</b></p>
        </div>
      </div>

      {/* Bảng sản phẩm - Dùng grid hoặc table Tailwind */}
      <table className="w-full table-fixed border-collapse mb-6">
        <thead>
          <tr className="border-b-2 border-black text-[10px] uppercase font-black">
            <th className="py-2 text-left w-[55%]">Sản phẩm</th>
            <th className="py-2 text-center w-[10%]">SL</th>
            <th className="py-2 text-right w-[17%]">Đơn giá</th>
            <th className="py-2 text-right w-[18%]">Thành tiền</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {order.products.map((item, index) => (
            <tr key={index} className="text-[11px]">
              <td className="py-2.5 font-bold leading-tight">{item.name}</td>
              <td className="py-2.5 text-center font-medium">x{item.quantity}</td>
              <td className="py-2.5 text-right">{item.price.toLocaleString()}</td>
              <td className="py-2.5 text-right font-black">
                {(item.price * item.quantity).toLocaleString()}đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tổng tiền */}
      <div className="flex justify-end">
        <div className="w-56 border-t-2 border-black pt-3 space-y-1">
          <div className="flex justify-between text-[10px] font-medium text-slate-500">
            <span>Phí vận chuyển:</span>
            <span>{(order.shippingFee || 0).toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between text-base font-black">
            <span>TỔNG CỘNG:</span>
            <span className="text-indigo-700">{order.totalAmount.toLocaleString()}đ</span>
          </div>
        </div>
      </div>

      {/* Footer chữ ký */}
      <div className="mt-12 grid grid-cols-2 text-center text-xs italic">
        <div>
          <p className="font-black not-italic mb-16">Người lập hóa đơn</p>
          <p className="text-[10px] opacity-50">(Ký và ghi rõ họ tên)</p>
        </div>
        <div>
          <p className="font-black not-italic mb-16">Khách hàng</p>
          <p className="text-[10px] opacity-50">(Ký và ghi rõ họ tên)</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;