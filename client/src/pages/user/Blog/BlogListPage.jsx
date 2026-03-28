import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Search, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import axios from 'axios';

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/blogs');
        if (response.data.success) {
          setBlogs(response.data.data);
          // Tự động gom nhóm danh mục từ dữ liệu bài viết
          const uniqueCats = ['Tất cả', ...new Set(response.data.data.map(blog => blog.category))];
          setCategories(uniqueCats);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
    window.scrollTo(0, 0);
  }, []);

  // Logic lọc bài viết
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'Tất cả' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* 1. BREADCRUMB & TIÊU ĐỀ */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-orange-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900">Tin tức & Sự kiện</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900">
            Kiến thức <span className="text-orange-600">Chống thấm</span>
          </h1>
          <p className="mt-4 text-slate-500 font-medium max-w-2xl">
            Cập nhật những kỹ thuật mới nhất và các giải pháp bảo vệ công trình bền vững từ chuyên gia Bảo Linh Tech.
          </p>
        </div>

        {/* 2. BỘ LỌC VÀ TÌM KIẾM (Giống ProductListPage) */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' 
                  : 'bg-white text-slate-500 hover:bg-orange-50 border border-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none font-medium"
            />
          </div>
        </div>

        {/* 3. DANH SÁCH BÀI VIẾT */}
        {loading ? (
          <div className="py-20 text-center font-bold text-slate-400 italic">Đang tải tin tức...</div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBlogs.map((blog) => (
              <article key={blog._id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-500 flex flex-col h-full">
                
                {/* Hình ảnh đại diện */}
                <Link to={`/blog/${blog.slug}`} className="relative h-64 overflow-hidden">
                  <img 
                    src={blog.thumbnail?.url || 'https://via.placeholder.com/600x400'} 
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-orange-600 rounded-lg">
                      {blog.category}
                    </span>
                  </div>
                </Link>

                {/* Nội dung tóm tắt */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-6 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-orange-500" />
                      {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-orange-500" />
                      5 phút đọc
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
                    <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8">
                    {blog.excerpt || "Khám phá những giải pháp công nghệ mới nhất cùng đội ngũ chuyên gia tại Bảo Linh Tech..."}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between group/btn">
                    <Link to={`/blog/${blog.slug}`} className="text-xs font-black uppercase tracking-widest text-slate-900 group-hover/btn:text-orange-600 transition-colors">
                      Đọc chi tiết
                    </Link>
                    <Link to={`/blog/${blog.slug}`} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 group-hover/btn:bg-orange-600 group-hover/btn:text-white transition-all">
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold text-xl">Không tìm thấy bài viết nào.</p>
            <button 
              onClick={() => {setSelectedCategory('Tất cả'); setSearchTerm('');}}
              className="mt-4 text-orange-600 font-black uppercase text-sm border-b-2 border-orange-600"
            >
              Xem tất cả bài viết
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;