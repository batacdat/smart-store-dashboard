import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Search, Filter, 
  Calendar, User, ChevronRight, MoreVertical, ExternalLink, 
  X, AlertTriangle, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'; // Cài đặt: npm install moment
import toast from 'react-hot-toast';

const BlogManagement = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho modal xóa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Lấy danh sách bài viết từ API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blogs');
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài viết:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Mở modal xác nhận xóa
  const openDeleteModal = (blog) => {
    setDeletingBlog(blog);
    setIsDeleteModalOpen(true);
  };

  // Đóng modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingBlog(null);
  };

  // Xử lý xóa bài viết
  const handleDelete = async () => {
    if (!deletingBlog) return;
    
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/blogs/${deletingBlog._id}`);
      if (response.data.success) {
        // Đóng modal
        closeDeleteModal();
        // Tải lại danh sách
        await fetchBlogs();
        // Hiển thị thông báo thành công (có thể dùng toast nếu có)
        toast.success("Xóa bài viết thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Lỗi khi xóa: " + (error.response?.data?.message || error.message));
    } finally {
      setIsDeleting(false);
    }
  };

  // Lọc bài viết theo ô tìm kiếm
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Quản lý bài viết</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Bạn có tổng cộng {blogs.length} bài viết trên hệ thống</p>
          </div>
          <Link 
            to="/admin/blog/create"
            className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 active:scale-95 w-fit"
          >
            <Plus size={20} /> Viết bài mới
          </Link>
        </div>

        {/* Toolbar Section */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm theo tiêu đề bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                <Filter size={18} /> Lọc
             </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-500">Bài viết</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-500">Danh mục</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-500">Người đăng</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-500">Ngày đăng</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-500 text-right">Thao tác</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-medium">
                        Đang tải dữ liệu bài viết...
                    </td>
                  </tr>
                ) : filteredBlogs.length > 0 ? (
                  filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                            <img 
                                src={blog.thumbnail?.url || 'https://via.placeholder.com/150'} 
                                alt={blog.title} 
                                className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="max-w-[300px]">
                            <p className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-teal-600 transition-colors">
                                {blog.title}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-tighter">
                                SLUG: {blog.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[11px] font-black uppercase">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                             {blog.author?.charAt(0)}
                           </div>
                           <span className="text-sm font-bold text-slate-600">{blog.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {moment(blog.createdAt).format('DD/MM/YYYY')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/blog/${blog.slug}`)}
                            className="p-2 text-slate-400 hover:text-teal-500 hover:bg-teal-50 rounded-xl transition-all"
                            title="Xem chi tiết"
                          >
                            <ExternalLink size={18} />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(blog)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Xóa bài viết"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-slate-400">
                        Không tìm thấy bài viết nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Xác nhận Xóa */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Xác nhận xóa</h3>
              </div>
              <button 
                onClick={closeDeleteModal}
                className="text-white/80 hover:text-white transition-colors"
                disabled={isDeleting}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="text-red-500" size={28} />
                </div>
                <p className="text-slate-700 font-medium mb-2">
                  Bạn có chắc chắn muốn xóa bài viết này?
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </p>
                
                {deletingBlog && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-4 text-left border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Thông tin bài viết</p>
                    <p className="font-bold text-slate-800 text-sm">{deletingBlog.title}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Danh mục: {deletingBlog.category} • Ngày đăng: {moment(deletingBlog.createdAt).format('DD/MM/YYYY')}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-white transition-all disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Xóa vĩnh viễn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;