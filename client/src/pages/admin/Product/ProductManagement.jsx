import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit3, Trash2, Loader2, PackageOpen, AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import toast from 'react-hot-toast';

// --- COMPONENT MODAL XÁC NHẬN XÓA ---
const DeleteModal = ({ isOpen, onClose, onConfirm, itemName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
            <AlertTriangle size={32} />
          </div>
          
          <h3 className="text-xl font-black text-slate-800 mb-2">Xác nhận xóa?</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Bạn có chắc chắn muốn xóa sản phẩm <span className="font-bold text-slate-800">"{itemName}"</span>? 
            Hành động này không thể hoàn tác.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mt-8">
            <button 
              onClick={onClose}
              disabled={loading}
              className="py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="py-3.5 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Xác nhận xóa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý Modal xóa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/products');
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Mở modal xóa
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Xử lý xóa thực tế
  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      const { data } = await axios.delete(`/products/${selectedProduct._id}`);
      if (data.success) {
        toast.success("Xóa sản phẩm thành công");
        setIsModalOpen(false);
        fetchProducts(); // Tải lại danh sách
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa thất bại");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-50">
        <Loader2 className="animate-spin text-teal-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="p-8 w-full bg-slate-50 min-h-screen font-sans">
      
      {/* 1. Header & Bộ lọc (Giữ nguyên giao diện cũ) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Quản lý sản phẩm</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Cửa hàng của bạn có {products.length} sản phẩm</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Tìm tên sản phẩm..." className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-teal-200 shadow-sm text-sm font-medium" />
          </div>
          <button className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-teal-600 shadow-sm transition-all"><Filter size={20} /></button>
          <Link to="/admin/add-product" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-teal-100 transition-all active:scale-95">
            <Plus size={20} /> <span className="hidden sm:inline">Thêm mới</span>
          </Link>
        </div>
      </div>

      {/* 2. Bảng sản phẩm */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Sản phẩm</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Danh mục</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Giá bán</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Tồn kho</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <PackageOpen size={64} className="mb-4" />
                      <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Chưa có sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 shadow-sm">
                          <img 
                            src={item.images?.[0]?.url || 'https://via.placeholder.com/150'} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="font-bold text-slate-700 text-sm line-clamp-1">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{item.category}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800">
                      {item.price?.toLocaleString() || 0}đ
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {item.stock > 0 ? ` ${item.stock}` : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Nút Sửa: Chuyển hướng sang trang Edit */}
                        <button 
                          onClick={() => navigate(`/admin/product/${item._id}`)}
                          className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit3 size={18} />
                        </button>
                        {/* Nút Xóa: Mở Modal xác nhận */}
                        <button 
                          onClick={() => handleDeleteClick(item)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Tích hợp Modal xóa */}
      <DeleteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmDelete} 
        itemName={selectedProduct?.name}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ProductManagement;