import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Tiêu đề bài viết là bắt buộc"],
    trim: true 
  },
  slug: { 
    type: String, 
    unique: true // Quan trọng để làm URL đẹp cho SEO
  },
  content: { 
    type: String, 
    required: [true, "Nội dung bài viết không được để trống"] 
  },
  author: { 
    type: String, 
    default: "Bảo Linh Tech" 
  },
  thumbnail: { 
    url: { type: String, required: true },
    public_id: { type: String } // Dùng nếu bạn upload ảnh lên Cloudinary
  },
  category: { 
    type: String, 
    default: "Tin tức" 
  },
  views: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;