import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import sendEmail from "../utils/sendEmail.js"
import dotenv from "dotenv"

dotenv.config();


/* ==============================
  1. JWT GENERATOR
============================== */

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}

const generateRefreshToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
    )
}



/* ==============================
   3. REGISTER ADMIN
============================== */

export const registerAdmin = async (req, res) => {

    try {

        const { name, email, password, repassword, phone } = req.body

        if (password !== repassword) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu xác nhận không khớp"
            })
        }

        const existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "Email đã tồn tại"
            })
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: "admin"
        })

        res.status(201).json({
            success: true,
            message: "Admin đã được tạo",
            data: user
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}


/* ==============================
   2. REGISTER USER (Bỏ Email)
============================== */
export const register = async (req, res) => {
    try {
        const { name, password, repassword, phone } = req.body;

        if (!name || !password || !repassword || !phone) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ các trường bắt buộc"
            });
        }

        if (password !== repassword) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu xác nhận không khớp"
            });
        }

        // Kiểm tra số điện thoại đã tồn tại chưa
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Số điện thoại này đã được đăng ký"
            });
        }

        const user = await User.create({
            name,
            phone,
            password,
            role: 'customer'
        });

        res.status(201).json({
            success: true,
            message: "Đăng ký tài khoản thành công"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { phone, email, password, isAdminPortal } = req.body;
        
        // 1. Xác định query dựa trên cổng đăng nhập
        const query = isAdminPortal ? { email } : { phone };
        
        // 2. Tìm user và lấy password ẩn
        const user = await User.findOne(query).select("+password");

        // 3. Kiểm tra user tồn tại và mật khẩu
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ 
                success: false, 
                message: "Thông tin đăng nhập không chính xác" 
            });
        }

        // 4. Kiểm tra quyền truy cập nếu là trang Admin
        if (isAdminPortal && user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: "Bạn không có quyền truy cập trang quản trị" 
            });
        }

        // 5. Phân luồng xử lý
        if (user.role === 'admin' && isAdminPortal) {
            // Luồng Admin: Yêu cầu bước OTP (không set cookie ở đây)
            return res.status(200).json({
                success: true,
                requiresOTP: true,
                message: "Thông tin hợp lệ, vui lòng kiểm tra email nhận mã OTP"
            });
        } else {
            // Luồng Customer: Đăng nhập thành công - SET COOKIE
            const token = generateToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
            
            // ✅ Lưu refreshToken vào database
            user.refreshToken = refreshToken;
            await user.save();
            
            // ✅ SET COOKIE token (access token)
            res.cookie('token', token, {
                httpOnly: true,           // Không cho JS truy cập
                secure: true,
                sameSite: "none",         // Chống CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
            });
            
            // ✅ SET COOKIE refreshToken
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ngày
            });
            
            // Trả về response (không cần trả token vì đã ở trong cookie)
            res.status(200).json({ 
                success: true, 
                message: "Đăng nhập thành công",
                user: {
                    _id: user._id,
                    name: user.name,
                    phone: user.phone,
                    role: user.role
                }
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ==============================
   3. SEND OTP (Đăng nhập bằng Email cho Admin)
============================== */
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Admin không tồn tại" });
        }

        // 1. Tạo OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        user.otp = await bcrypt.hash(otp, salt);
        user.otpExpire = Date.now() + 3 * 60 * 1000;
        await user.save();

        // 2. Gửi Email (Quan trọng: Phải dùng await)
        try {
            await sendEmail(
            user.email,                           // Tham số 'to'
            "Mã xác thực Admin Login",            // Tham số 'subject'
            `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 3 phút.` // Tham số 'text'
        );

            res.status(200).json({
                success: true,
                message: "Mã OTP đã được gửi tới email của bạn"
            });
        } catch (mailError) {
            // Nếu gửi mail lỗi, xóa OTP trong DB để tránh rác dữ liệu
            user.otp = undefined;
            user.otpExpire = undefined;
            await user.save();
            
            console.error("Lỗi gửi mail:", mailError);
            return res.status(500).json({ 
                success: false, 
                message: "Hệ thống không thể gửi email. Vui lòng kiểm tra cấu hình SMTP." 
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ==============================
   4. VERIFY OTP (Dùng email)
============================== */
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.otp) {
            return res.status(400).json({ success: false, message: "Yêu cầu không hợp lệ" });
        }

        if (user.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, message: "Mã OTP đã hết hạn" });
        }

        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Mã OTP không chính xác" });
        }

        user.otp = undefined;
        user.otpExpire = undefined;
        
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        
        // ✅ Lưu refreshToken vào database
        user.refreshToken = refreshToken;
        await user.save();
        
        // ✅ SET COOKIE token (access token)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        // ✅ SET COOKIE refreshToken
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ==============================
   6. REFRESH TOKEN
============================== */

export const refreshToken = async (req, res) => {

    try {

        const token = req.cookies.refreshToken

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token không tồn tại"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

        const user = await User.findById(decoded.id)

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({
                success: false,
                message: "Refresh token không hợp lệ"
            })
        }

        const newToken = generateToken(user._id)

        res.cookie("token", newToken, {
            httpOnly: true,
            secure: true,
                sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            message: "Token đã được làm mới"
        })

    } catch (error) {

        res.status(401).json({
            success: false,
            message: "Refresh token hết hạn"
        })

    }

}



/* ==============================
   7. CHANGE PASSWORD
============================== */

export const changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword, confirmPassword } = req.body

        const user = await User.findById(req.user._id).select("+password")

        const isMatch = await bcrypt.compare(currentPassword, user.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu cũ không đúng"
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Xác nhận mật khẩu không khớp"
            })
        }

        user.password = newPassword

        await user.save()

        res.status(200).json({
            success: true,
            message: "Đổi mật khẩu thành công"
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}



/* ==============================
   8. FORGOT PASSWORD: 
   hàm này chỉ có nhiệm vụ gửi OTP reset password, 
   sau khi verify OTP thành công sẽ gọi hàm resetPassword để đặt lại mật khẩu mới
============================== */

export const forgotPassword = async (req, res) => {
    try {
        const { phone, email } = req.body; // Nhận phone để tìm user, email để gửi mã

        if (!phone || !email) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập số điện thoại và email nhận mã" });
        }

        // 1. Tìm User bằng Số điện thoại
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ success: false, message: "Số điện thoại này chưa được đăng ký" });
        }

        // 2. Tạo OTP và lưu vào User đó
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        user.otp = await bcrypt.hash(otp, salt);
        user.otpExpire = Date.now() + 15 * 60 * 1000; 
        
        await user.save();

        // 3. Gửi OTP đến cái email mà người dùng vừa nhập (không cần email đã đăng ký)
        const message = `Mã OTP khôi phục mật khẩu cho tài khoản ${phone} là: ${otp}`;
        await sendEmail(email, "Mã xác thực Smart Store", message);

        res.status(200).json({ success: true, message: "Mã OTP đã được gửi đến email của bạn" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
 // hàm này kết hợp với hàm forgotPassword để reset password sau khi verify OTP thành công ===========
// controllers/authController.js

/* ==============================
   8. RESET PASSWORD
============================== */
export const resetPassword = async (req, res) => {
    try {
        const { phone, otp, newPassword } = req.body;

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });
        }

        // 1. Kiểm tra OTP
        if (!user.otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, message: "Mã OTP đã hết hạn" });
        }

        const isValidOTP = await bcrypt.compare(otp, user.otp);
        if (!isValidOTP) {
            return res.status(400).json({ success: false, message: "Mã OTP không đúng" });
        }

        // 2. Cập nhật mật khẩu mới
        // Lưu ý: Nếu Model User của bạn đã có middleware pre-save bcrypt thì chỉ cần gán.
        // Nhưng để chắc chắn và sửa lỗi 401, ta reset refreshToken về null.
        user.password = newPassword; 
        
        // 3. QUAN TRỌNG: Xóa sạch dấu vết phiên cũ và OTP
        user.otp = undefined;
        user.otpExpire = undefined;
        user.refreshToken = null; // Hủy token cũ để tránh lỗi 401 do xung đột phiên

        await user.save();

        res.status(200).json({
            success: true,
            message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại!"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/* ==============================
   9. LOGOUT
============================== */

export const logout = async (req, res) => {

    const user = await User.findById(req.user._id)

    if (user) {
        user.refreshToken = null
        await user.save()
    }

    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0)
    })

    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0)
    })

    res.status(200).json({
        success: true,
        message: "Đăng xuất thành công"
    })

}
 export const getAllUsers = async (req, res) => {
        try {
            const users = await User.getAllUsers();
            res.status(200).json({ success: true, users });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
};  
          