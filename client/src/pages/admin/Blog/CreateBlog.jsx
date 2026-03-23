import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, ArrowLeft, Image as ImageIcon, Type, Layout, 
  User, Send, UploadCloud, X, FileText, Zap 
} from 'lucide-react';
import axios from 'axios';

const CreateBlog = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Ref để trigger chọn file
  const [loading, setLoading] = useState(false);
  
  // State quản lý ảnh xem trước
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '', // Thêm trường tóm tắt ngắn
    content: '',
    author: 'Bảo Linh Tech', // Có thể lấy từ AuthContext
    category: 'Tin tức',
    status: 'Published', // Mặc định là xuất bản
    thumbnailFile: null, // Lưu file ảnh thực tế để gửi lên server
    videoUrl: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý khi chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Giới hạn 5MB
        alert("File ảnh quá lớn. Vui lòng chọn file dưới 5MB.");
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

  // Xóa ảnh đã chọn
  const removeImage = () => {
    setFormData({ ...formData, thumbnailFile: null });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input file
    }
  };

  const handleSubmit = async (e, currentStatus) => {
    e.preventDefault();
    if(!formData.thumbnailFile) {
        alert("Vui lòng chọn ảnh đại diện cho bài viết.");
        return;
    }
    setLoading(true);

    try {
      // Vì có gửi file, ta phải dùng FormData thay vì JSON thông thường
      const data = new FormData();
      data.append('title', formData.title);
      data.append('excerpt', formData.excerpt);
      data.append('content', formData.content);
      data.append('author', formData.author);
      data.append('category', formData.category);
      data.append('status', currentStatus || formData.status);
      data.append('videoUrl', formData.videoUrl);
      data.append('image', formData.thumbnailFile); // File ảnh

      // Gọi API đến Backend
      const response = await axios.post('/api/blogs', data, {
        headers: {
          'Content-Type': 'multipart/form-data' // Bắt buộc khi gửi file
        }
      });
      
      if (response.data.success) {
        alert("Đăng bài viết thành công!");
        navigate('/admin/blog'); // Chuyển về danh sách quản lý blog
      }
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi đăng bài.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* HEADER SECTION (Giống AddProduct) */}
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
                className="px-6 py-3 bg-white text-slate-600 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all text-sm flex items-center gap-2"
              >
                 <FileText size={16}/> Lưu nháp
              </button>
              <button 
                type="button"
                onClick={(e) => handleSubmit(e, 'Published')}
                disabled={loading}
                className="px-6 py-3 bg-teal-600 text-white rounded-xl font-black hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 active:scale-95 disabled:bg-slate-400 text-sm flex items-center gap-2"
              >
                {loading ? "Đang xử lý..." : <><Zap size={16}/> Xuất bản ngay</>}
              </button>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI: NỘI DUNG CHÍNH (Chiếm 2/3) */}
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
                    type="text"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="Ví dụ: https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal-400"
                  />
                </div>
            </div>

            {/* Khối Nội dung chi tiết */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-2">
              <label className="flex items-center gap-2.5 text-sm font-bold text-slate-700 mb-2">
                <Layout size={17} className="text-teal-500" /> Nội dung chi tiết bài viết <span className="text-red-500">*</span>
              </label>
              {/* Sau này nên thay textarea bằng Rich Text Editor như ReactQuill */}
              <textarea 
                name="content"
                required
                rows="25"
                value={formData.content}
                onChange={handleChange}
                placeholder="Bắt đầu viết nội dung tuyệt vời của bạn ở đây..."
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 outline-none transition-all resize-none leading-relaxed"
              ></textarea>
            </div>
          </div>

          {/* CỘT PHẢI: THIẾT LẬP PHỤ (Chiếm 1/3) */}
          <div className="space-y-8 sticky top-28 h-fit">
            
            {/* Khối Tải ảnh đại diện (NÂNG CẤP MỚI) */}
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4">
                  <ImageIcon size={17} className="text-teal-500" /> Ảnh đại diện bài viết (Thumbnail)
                </label>
                
                <input 
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" // Giấu input file mặc định
                />

                {imagePreview ? (
                  // Giao diện khi đã chọn ảnh
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
                  // Giao diện khi chưa chọn ảnh (Khu vực Drag & Drop)
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl aspect-[16/10] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-all text-slate-500 hover:text-teal-600"
                  >
                    <div className="p-4 bg-slate-100 rounded-full text-slate-400 group-hover:bg-teal-100 transition">
                       <UploadCloud size={28} />
                    </div>
                    <div className="text-center px-4">
                        <p className="font-bold text-sm">Nhấn để tải ảnh</p>
                        <p className="text-xs opacity-70 mt-1">hoặc kéo thả file vào đây (Max 5MB)</p>
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
                  <option value="Tin tức">Tin tức</option>
                  <option value="Tư vấn">Tư vấn</option>
                  <option value="Review">Review</option>
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