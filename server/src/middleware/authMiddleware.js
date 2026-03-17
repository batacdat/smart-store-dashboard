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

        // lấy token từ cookie
        if (req.cookies && req.cookies.token) {

            token = req.cookies.token;
        }

        // lấy token từ Authorization header
        if (!token && req.headers.authorization) {

            const authHeader = req.headers.authorization;

            if (authHeader.startsWith("Bearer ")) {

                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Bạn cần đăng nhập"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "User không tồn tại"
            });
        }

        req.user = user;
        next();
    } catch (error) {

        console.error("Auth error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn"
        });
    }
};

/*
================================
ADMIN MIDDLEWARE
================================
*/

export const admin = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Chưa đăng nhập"
        });
    }
    if (req.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập"
        });
    }
    next();

};