import React, { useState, useRef } from 'react';
import { 
  Package, DollarSign, Layers3, Target, UploadCloud, 
  ChevronLeft, Loader2, Trash2, Info, Star 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// IMPORT HÀM API TẠI ĐÂY
import { createProduct } from '../../api/productApi'; 

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: 0,
    isFeatured: false,
    images: []
  });

  const [previews, setPreviews] = useState([]);
  const categories = ["Keo chống thấm", "Màng chống thấm", "Sơn chống thấm", "Khác"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    URL.revokeObjectURL(previews[index]);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
    setPreviews(updatedPreviews);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (formData.images.length === 0) return toast.error("Vui lòng chọn ảnh");

  setLoading(true);
  const myForm = new FormData();
  
  // Thêm các trường text
  myForm.append('name', formData.name);
  myForm.append('description', formData.description);
  myForm.append('price', formData.price);
  myForm.append('category', formData.category);
  myForm.append('stock', formData.stock);

  // Quan trọng: Tên key phải là 'images' trùng với upload.array('images') ở Backend
  formData.images.forEach((file) => {
    myForm.append('images', file); 
  });

  try {
    const { data } = await createProduct(myForm);
    if (data.success) {
      toast.success("Thành công!");
      navigate('/admin/products');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Lỗi gửi dữ liệu");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-4 md:p-8 w-full bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-teal-600 transition-all shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Thêm sản phẩm mới</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Smart Store Management</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Thông tin */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl"><Info size={20}/></div>
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Thông tin cơ bản</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên sản phẩm</label>
                <input type="text" name="name" required placeholder="Nhập tên sản phẩm..." className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-bold text-slate-800" value={formData.name} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Mô tả</label>
                <textarea name="description" rows="5" required placeholder="Mô tả sản phẩm chi tiết..." className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-medium text-slate-600" value={formData.description} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

          {/* Card 2: Hình ảnh */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl"><UploadCloud size={20}/></div>
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Hình ảnh sản phẩm</h3>
            </div>

            <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-teal-50/30 hover:border-teal-200 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-all group-hover:scale-110">
                <UploadCloud size={32} />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-700">Tải ảnh lên từ thiết bị</p>
                <p className="text-[11px] text-slate-400 font-medium mt-1">Dung lượng tối đa 2MB mỗi ảnh</p>
              </div>
            </div>
            <input type="file" ref={fileInputRef} hidden multiple accept="image/*" onChange={handleFileChange} />

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {previews.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm group">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl"><Target size={20}/></div>
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Giá & Kho</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Giá bán (VNĐ)</label>
                <div className="relative">
                   <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input type="number" name="price" required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-bold text-slate-800" value={formData.price} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Số lượng kho</label>
                <div className="relative">
                   <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input type="number" name="stock" required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-bold text-slate-800" value={formData.stock} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl"><Layers3 size={20}/></div>
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Phân loại</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Danh mục</label>
                <select name="category" required className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-bold text-slate-800 appearance-none" value={formData.category} onChange={handleChange}>
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all group">
                <div className="flex items-center gap-3">
                  <Star size={20} className={formData.isFeatured ? "text-amber-500 fill-amber-500" : "text-slate-300 group-hover:text-amber-400"} />
                  <span className="text-sm font-bold text-slate-700">Sản phẩm nổi bật</span>
                </div>
                <input type="checkbox" name="isFeatured" className="w-5 h-5 accent-teal-600 rounded-lg" checked={formData.isFeatured} onChange={handleChange} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => navigate(-1)} className="py-4 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 active:scale-95 transition-all shadow-sm">Hủy bỏ</button>
            <button type="submit" disabled={loading} className="py-4 bg-teal-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-teal-200 hover:bg-teal-700 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Xác nhận"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;