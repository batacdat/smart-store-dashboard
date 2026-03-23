import Blog from '../models/Blog.js';
import cloudinary from '.././config/cloudinary.js';
// @desc    Lấy tất cả bài viết
// @route   GET /api/blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }); // Bài mới nhất lên đầu
        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Lấy chi tiết một bài viết theo Slug (Tốt cho SEO)
// @route   GET /api/blogs/:slug
export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        
        if (!blog) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
        }

        // Tăng lượt xem mỗi khi có người đọc
        blog.views += 1;
        await blog.save();

        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Tạo bài viết mới (Dành cho Admin)
// @route   POST /api/blogs
export const createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, author, status, videoUrl } = req.body;

        // 1. Kiểm tra xem có file ảnh được gửi lên không
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Vui lòng tải lên ảnh đại diện" });
        }

        // 2. Upload ảnh lên Cloudinary (Dạng buffer từ Multer)
        // Lưu ý: Bạn cần cấu hình multer ở file Routes trước khi gọi controller này
        const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "blogs" }, // Thư mục lưu trên Cloudinary
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        // 3. Tạo slug tự động
        const slug = title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        // 4. Lưu vào Database
        const blog = await Blog.create({
            title,
            slug,
            content,
            excerpt,
            author,
            category,
            status,
            videoUrl,
            thumbnail: {
                url: uploadResponse.secure_url,
                public_id: uploadResponse.public_id
            }
        });

        res.status(201).json({ 
            success: true, 
            message: "Đăng bài viết thành công",
            data: blog 
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Tiêu đề bài viết đã tồn tại" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy bài viết để xóa" 
            });
        }

        await blog.deleteOne();

        res.status(200).json({ 
            success: true, 
            message: "Đã xóa bài viết thành công" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Lỗi khi xóa bài viết: " + error.message 
        });
    }
};