import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, ArrowLeft, Image as ImageIcon, Type, Layout, 
  User, Send, UploadCloud, X, FileText, Zap 
} from 'lucide-react';
import axios from '../../../api/axios';
import toast from 'react-hot-toast'; // Thêm toast cho thông báo đẹp hơn

const CreateBlog = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Bảo Linh',
    category: 'Hướng dẫn thi công',
    status: 'Published',
    thumbnailFile: null,
    videoUrl: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File ảnh quá lớn. Vui lòng chọn file dưới 5MB.");
        return;
      }
      
      // Kiểm tra định dạng file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Chỉ chấp nhận file ảnh định dạng JPEG, PNG, WEBP");
        return;
      }
      
      setFormData({ ...formData, thumbnailFile: file });
      
      // Tạo URL xem trước
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, thumbnailFile: null });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Hàm validate dữ liệu
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết");
      return false;
    }
    
    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết");
      return false;
    }
    
    if (!formData.thumbnailFile) {
      toast.error("Vui lòng chọn ảnh đại diện cho bài viết");
      return false;
    }
    
    if (formData.title.length < 10) {
      toast.error("Tiêu đề quá ngắn (tối thiểu 10 ký tự)");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e, currentStatus) => {
    e.preventDefault();
    
    // Validate dữ liệu
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Hiển thị thông báo đang xử lý
    const loadingToast = toast.loading("Đang xử lý...");

    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('excerpt', formData.excerpt.trim());
      data.append('content', formData.content.trim());
      data.append('author', formData.author.trim());
      data.append('category', formData.category);
      data.append('status', currentStatus || formData.status);
      data.append('videoUrl', formData.videoUrl.trim());
      data.append('image', formData.thumbnailFile);

      // Log để debug
      console.log('📤 Sending blog data:');
      for (let pair of data.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: [File] ${pair[1].name} (${(pair[1].size / 1024).toFixed(2)} KB)`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      // SỬA: Bỏ '/api' vì axios đã có baseURL
      const response = await axios.post('/blogs', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('✅ Response:', response.data);
      
      if (response.data.success) {
        toast.success("Đăng bài viết thành công!", { id: loadingToast });
        
        // Reset form sau khi thành công
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          author: 'Bảo Linh',
          category: 'Hướng dẫn thi công',
          status: 'Published',
          thumbnailFile: null,
          videoUrl: '',
        });
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Chuyển về danh sách blog sau 1.5s
        setTimeout(() => {
          navigate('/admin/blog');
        }, 1500);
      } else {
        toast.error(response.data.message || "Đăng bài thất bại", { id: loadingToast });
      }
    } catch (error) {
      console.error('❌ Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Xử lý lỗi chi tiết
      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Dữ liệu không hợp lệ", { id: loadingToast });
      } else if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại", { id: loadingToast });
        setTimeout(() => navigate('/login'), 1500);
      } else if (error.response?.status === 413) {
        toast.error("File quá lớn, vui lòng chọn file nhỏ hơn", { id: loadingToast });
      } else {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi đăng bài", { id: loadingToast });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/blog')}
              className="p-2.5 bg-white rounded-xl shadow-sm hover:text-teal-600 transition border border-slate-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Khối nội dung</p>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Viết bài mới</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={(e) => handleSubmit(e, 'Draft')}
                disabled={loading}
                className="px-6 py-3 bg-white text-slate-600 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                 <FileText size={16}/> Lưu nháp
              </button>
              <button 
                type="button"
                onClick={(e) => handleSubmit(e, 'Published')}
                disabled={loading}
                className="px-6 py-3 bg-teal-600 text-white rounded-xl font-black hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 active:scale-95 disabled:opacity-50 text-sm flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <><Zap size={16}/> Xuất bản ngay</>
                )}
              </button>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Khối Tiêu đề & Tóm tắt */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                  <Type size={17} className="text-teal-500" /> Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề hấp dẫn, thu hút người đọc..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 outline-none transition-all font-extrabold text-xl tracking-tight"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {formData.title.length}/200 ký tự
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                  <FileText size={17} className="text-teal-500" /> Tóm tắt ngắn (Excerpt)
                </label>
                <textarea 
                  name="excerpt"
                  rows="3"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Viết một đoạn mô tả ngắn gọn về bài viết (khoảng 2-3 câu)..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 outline-none transition-all resize-none text-slate-600 leading-relaxed"
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Link Video Youtube (Nếu có)</label>
                <input 
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="Ví dụ: https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal-400"
                />
              </div>
            </div>

            {/* Khối Nội dung chi tiết */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-2">
              <label className="flex items-center gap-2.5 text-sm font-bold text-slate-700 mb-2">
                <Layout size={17} className="text-teal-500" /> Nội dung chi tiết bài viết <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="content"
                required
                rows="25"
                value={formData.content}
                onChange={handleChange}
                placeholder="Bắt đầu viết nội dung tuyệt vời của bạn ở đây..."
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 outline-none transition-all resize-none leading-relaxed font-mono"
              ></textarea>
            </div>
          </div>

          {/* CỘT PHẢI: THIẾT LẬP PHỤ */}
          <div className="space-y-8 sticky top-28 h-fit">
            
            {/* Khối Tải ảnh đại diện */}
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4">
                  <ImageIcon size={17} className="text-teal-500" /> Ảnh đại diện bài viết <span className="text-red-500">*</span>
                </label>
                
                <input 
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-slate-100 aspect-[16/10] shadow-inner bg-slate-50">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition backdrop-blur-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl aspect-[16/10] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-all text-slate-500 hover:text-teal-600"
                  >
                    <div className="p-4 bg-slate-100 rounded-full">
                       <UploadCloud size={28} />
                    </div>
                    <div className="text-center px-4">
                        <p className="font-bold text-sm">Nhấn để tải ảnh</p>
                        <p className="text-xs opacity-70 mt-1">JPEG, PNG, WEBP (Max 5MB)</p>
                    </div>
                  </div>
                )}
            </div>

            {/* Khối Thông tin bổ sung */}
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Chuyên mục</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 transition font-medium text-sm"
                >
                  <option value="Tin tức">Hướng dẫn thi công</option>
                  <option value="Tư vấn">Tư vấn</option>
                  <option value="Review">Review sản phẩm</option>
                  <option value="Khuyến mãi">Khuyến mãi</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tác giả</label>
                <input 
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-slate-600 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Trạng thái</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal-400 font-medium text-sm"
                >
                  <option value="Published">Xuất bản</option>
                  <option value="Draft">Bản nháp</option>
                </select>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;