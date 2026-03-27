import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

/*
================================
PROTECT ROUTE
================================
*/

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Ưu tiên lấy token từ Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        
        // 2. Nếu không có trong header, lấy từ cookie
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        // 3. Kiểm tra token tồn tại
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Bạn cần đăng nhập để truy cập"
            });
        }

        // 4. Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            // Xử lý chi tiết lỗi JWT
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại"
                });
            }
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Token không hợp lệ"
                });
            }
            throw jwtError;
        }

        // 5. Tìm user trong database
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        // 6. Gán user vào request
        req.user = user;
        next();
        
    } catch (error) {
        console.error("Auth error:", error.message);
        
        return res.status(401).json({
            success: false,
            message: "Xác thực thất bại",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/*
================================
ADMIN MIDDLEWARE
================================
*/

export const admin = (req, res, next) => {
    // Kiểm tra đã đăng nhập chưa
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Chưa đăng nhập"
        });
    }
    
    // Kiểm tra role admin
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập. Yêu cầu quyền admin."
        });
    }
    
    next();
};

/*
================================
OPTIONAL: CHECK OWNER OR ADMIN
================================
*/

// Middleware kiểm tra người dùng có phải chủ sở hữu hoặc admin không
export const checkOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Chưa đăng nhập"
        });
    }
    
    // Admin luôn được phép
    if (req.user.role === "admin") {
        return next();
    }
    
    // Kiểm tra userId từ params có khớp với user đang đăng nhập không
    const userId = req.params.userId || req.params.id;
    if (userId && userId !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền thực hiện hành động này"
        });
    }
    
    next();
};