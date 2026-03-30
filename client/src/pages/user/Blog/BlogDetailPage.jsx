import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2, Clock, Video } from 'lucide-react';
import axios from 'axios';

// Ảnh nền dự phòng nếu video không có thumbnail riêng
import videoDefaultBg from "../../../assets/house.jpg"; 

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm hỗ trợ chuyển đổi link Youtube sang link nhúng (Embed)
const getEmbedUrl = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  // Quan trọng: Phải là /embed/ thì iframe mới cho phép phát
  if (match && match[2].length === 11) {
    // Luôn trả về URL với giao thức HTTPS đầy đủ
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
};

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/blogs/${slug}`);
        if (response.data.success) {
          setBlog(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-orange-600 font-bold italic">Đang tải nội dung bài viết...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Không tìm thấy bài viết!</h2>
        <button onClick={() => navigate('/blog')} className="text-orange-600 font-bold flex items-center gap-2">
          <ArrowLeft size={20} /> Quay lại danh sách tin tức
        </button>
      </div>
    );
  }

  const embedVideoUrl = getEmbedUrl(blog.videoUrl);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 1. HEADER BÀI VIẾT */}
      <div className="pt-32 pb-12 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={18} /> Trở về
          </button>

          <div className="space-y-6">
            <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest">
              {blog.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-slate-900 leading-[1.2] tracking-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-bold pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <User size={18} className="text-orange-500" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-orange-500" />
                <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-orange-500" />
                <span>{(blog.content?.length / 1000).toFixed(0) || 5} phút đọc</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HÌNH ẢNH BANNER CHÍNH */}
      <div className="container mx-auto px-4 max-w-5xl -mt-8">
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-900/10 border-8 border-white bg-white">
          <img 
            src={blog.thumbnail?.url || 'https://via.placeholder.com/1200x600'} 
            alt={blog.title}
            className="w-full h-full object-cover max-h-[550px]"
          />
        </div>
      </div>

      {/* 3. NỘI DUNG BÀI VIẾT */}
      <div className="container mx-auto px-4 max-w-3xl mt-16">
        {blog.excerpt && (
          <p className="text-xl md:text-2xl font-medium text-slate-600 italic border-l-4 border-orange-500 pl-6 mb-12 leading-relaxed">
            {blog.excerpt}
          </p>
        )}

        {/* Nội dung chính: whitespace-pre-line giữ ngắt nghỉ dòng */}
        <div className="text-md md:text-lg text-slate-700 leading-relaxed whitespace-pre-line mb-16">
          {blog.content}
        </div>

        {/* 4. KHU VỰC VIDEO LIÊN QUAN (Chỉ hiện khi có videoUrl) */}
 {embedVideoUrl && (
      <div className="mt-16 mb-20 p-6 md:p-10 bg-orange-600 rounded-[2.5rem] shadow-2xl shadow-orange-900/20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 blur-sm">
            <img src={videoDefaultBg} alt="bg" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-white mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                    <Video size={24} />
                </div>
                <h3 className="text-2xl font-black tracking-tight">
                    Video thực tế công trình
                </h3>
            </div>

            {/* Tỉ lệ khung hình Video */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-inner border-4 border-white/30 bg-black">
            <iframe 
                className="absolute inset-0 w-full h-full"
                src={embedVideoUrl} 
                title="YouTube video player"
                frameBorder="0" 
                // Thêm dòng này để tránh lỗi bảo mật trên một số trình duyệt
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            ></iframe>
            </div>
            <p className="text-orange-100 text-sm font-medium italic text-center">
                ChongThamBaoLinh - Trực tiếp thi công và giám sát chất lượng sản phẩm
            </p>
        </div>
      </div>
    )}

        {/* 5. FOOTER BÀI VIẾT */}
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-orange-500" />
            <span className="text-sm font-black uppercase text-slate-900 tracking-widest">{blog.category}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-400 italic">Chia sẻ:</span>
            <div className="flex gap-2">
                <button className="p-3 bg-slate-50 hover:bg-orange-500 hover:text-white rounded-2xl transition-all text-slate-400 shadow-sm">
                    <Share2 size={20} />
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;