import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import axios from 'axios';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/blogs');
        if (response.data.success) {
          setBlogs(response.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-500 font-medium">Đang tải tin tức...</div>;
  }

  return (   
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* 1. TIÊU ĐỀ ĐÃ CĂN GIỮA */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black text-orange-600 uppercase tracking-widest mb-4">
            Tin tức & Sự kiện
          </h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-wider leading-snug md:leading-relaxed">
            Cập nhật mới nhất từ <br/> 
            <span className="text-orange-600 uppercase text-[24px] md:text-3xl">CHONGTHAMBAOLINH</span>
          </h3>
          <div className="w-24 h-1.5 bg-orange-600 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* 2. DANH SÁCH CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogs.map((blog) => (
            <article 
              key={blog._id} 
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-500 flex flex-col h-full"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={blog.thumbnail?.url || 'https://via.placeholder.com/600x400'} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-5 left-5">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-5">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-orange-500" />
                    {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-orange-500" />
                    {blog.author}
                  </div>
                </div>

                <Link to={`/blog/${blog.slug}`}>
                  <h4 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
                    {blog.title}
                  </h4>
                </Link>

                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 flex-grow">
                  {blog.excerpt || "Khám phá những kiến thức và công nghệ mới nhất cùng đội ngũ chuyên gia tại Bảo Linh Tech..."}
                </p>

                <Link 
                  to={`/blog/${blog.slug}`}
                  className="pt-6 border-t border-slate-50 flex items-center justify-between group/btn"
                >
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover/btn:text-orange-600 transition-colors">
                    Đọc chi tiết
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/btn:bg-orange-600 group-hover/btn:text-white transition-all">
                    <ArrowRight size={18} />
                  </div>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* 3. NÚT XEM TẤT CẢ CHUYỂN XUỐNG DƯỚI */}
        <div className="flex justify-center">
          <Link 
            to="/blog" 
            className="group flex items-center gap-4 bg-white border border-slate-200 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-lg shadow-slate-200/50"
          >
            Xem tất cả bài viết
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
  );
};

export default BlogSection;