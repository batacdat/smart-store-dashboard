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

/* ==============================
   3. SEND OTP (Đăng nhập bằng Số điện thoại)
============================== */
export const sendOTP = async (req, res) => {
    try {
        const { phone, password, isAdminPortal } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập số điện thoại và mật khẩu" });
        }

        // Tìm user theo phone và lấy cả password ẩn
        const user = await User.findOne({ phone }).select("+password");
        
        if (!user) {
            return res.status(404).json({ success: false, message: "Tài khoản không tồn tại" });
        }

        if (isAdminPortal && user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập trang quản trị" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Mật khẩu không chính xác" });
        }

        // Tạo mã OTP ngẫu nhiên 6 số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        user.otp = await bcrypt.hash(otp, salt);
        user.otpExpire = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút
        await user.save();

        // MÔ PHỎNG GỬI SMS: Log ra console (Bạn hãy tích hợp SMS API tại đây)
        console.log(`[SMS] OTP gửi tới số ${phone}: ${otp}`);

        res.status(200).json({
            success: true,
            message: "Mã OTP đã được gửi tới số điện thoại của bạn"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/* ==============================
   4. VERIFY OTP (Dùng phone)
============================== */
export const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        const user = await User.findOne({ phone });
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
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            token,
            user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}




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
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
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

        const { email } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email không tồn tại"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        const hashedOTP = await bcrypt.hash(otp, 10)

        user.otp = hashedOTP
        user.otpExpire = Date.now() + 5 * 60 * 1000

        await user.save()

        await sendEmail(
            user.email,
            "OTP khôi phục mật khẩu",
            `Mã OTP đặt lại mật khẩu của bạn là: ${otp}`
        )

        res.status(200).json({
            success: true,
            message: "OTP reset password đã gửi tới email"
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}
 // hàm này kết hợp với hàm forgotPassword để reset password sau khi verify OTP thành công ===========
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body

        // 1. Validate
        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin"
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu xác nhận không khớp"
            })
        }

        // 2. Tìm user
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User không tồn tại"
            })
        }

        // 3. Kiểm tra OTP
        if (!user.otp) {
            return res.status(400).json({
                success: false,
                message: "Chưa yêu cầu OTP"
            })
        }

        const isValidOTP = await bcrypt.compare(otp, user.otp)

        if (!isValidOTP) {
            return res.status(400).json({
                success: false,
                message: "OTP không đúng"
            })
        }

        if (user.otpExpire < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP đã hết hạn"
            })
        }

        // 4. Update password
        user.password = newPassword

        // clear OTP
        user.otp = undefined
        user.otpExpire = undefined

        await user.save()

        res.status(200).json({
            success: true,
            message: "Đặt lại mật khẩu thành công"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

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
        expires: new Date(0)
    })

    res.cookie("refreshToken", "", {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({
        success: true,
        message: "Đăng xuất thành công"
    })

}