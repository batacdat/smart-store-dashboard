import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token= req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Lấy thông tin người dùng từ token - không lấy mật khẩu
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401).json({success: false, message: 'Phiên đăng nhập hết hạn' });
        }
    }
    if(!token){
        res.status(401).json({success: false, message: 'Bạn cần đăng nhập để thực hiện thao tác này' });
    }
};


// Middleware kiểm tra quyền admin
export const admin = (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        next();
    } else {
        res.status(403).json({success: false, message: 'Bạn không có quyền truy cập tài nguyên này' });
    }
};