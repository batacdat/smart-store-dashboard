import express from 'express';
import multer from 'multer';
import { createBlog, getAllBlogs, getBlogBySlug, deleteBlog } from '../controllers/blogController.js';

const router = express.Router();

// Cấu hình lưu trữ tạm thời trong bộ nhớ (Memory Storage) để gửi sang Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/')
    .get(getAllBlogs)
    .post(upload.single('image'), createBlog); // 'image' phải khớp với key trong FormData ở Frontend

router.get('/:slug', getBlogBySlug);
router.delete('/:id', deleteBlog);

export default router;