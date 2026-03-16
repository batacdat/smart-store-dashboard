import express from 'express';
import { register, registerAdmin, sendOTP, verifyOTP } from '../controllers/authController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Đăng ký người dùng mới
router.post('/register', register);

// Đăng ký Admin (Bảo vệ: phải đăng nhập + phải là Admin mới gọi được)
router.post('/register-admin', protect, admin, registerAdmin);

// Gửi mã OTP
router.post('/send-otp', sendOTP);
// Xác thực OTP và đăng nhập
router.post('/verify-otp', verifyOTP);
export default router;