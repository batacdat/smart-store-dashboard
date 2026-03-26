import express from "express";

import {
    register,
    registerAdmin,
    sendOTP,
    verifyOTP,
    refreshToken,
    changePassword,
    forgotPassword,
    logout,
    resetPassword,
    login,
   getAllUsers
} from "../controllers/authController.js";

import {
    protect,
    admin
} from "../middleware/authMiddleware.js";


const router = express.Router();

/*
================================
AUTHENTICATION
================================
*/

// đăng ký user
router.post("/register", register);

// đăng ký admin (chỉ admin mới tạo được admin khác)
router.post("/register-admin", protect, admin, registerAdmin);

/*
================================
LOGIN WITH OTP
================================
*/
router.post('/login', login);
// login bước 1 (email + password)
router.post("/send-otp", sendOTP);

// login bước 2 (verify OTP)
router.post("/verify-otp", verifyOTP);

/*
================================
TOKEN
================================
*/

// refresh access token
router.get("/refresh-token", refreshToken);

/*
================================
PASSWORD
================================
*/

// đổi mật khẩu
router.put("/change-password", protect, changePassword);

// quên mật khẩu
router.post("/forgot-password", forgotPassword);

// reset mật khẩu (kết hợp với forgotPassword)
router.post("/reset-password", resetPassword)
/*
================================
LOGOUT
================================
*/

// logout
router.post("/logout", protect, logout);
router.get("/", getAllUsers);


export default router;