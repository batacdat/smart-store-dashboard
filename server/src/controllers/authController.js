import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};


// Đăng ký người dùng mới
export const register = async (req, res) => {

    try {

        const { name, email, password, repassword, phone } = req.body;

        // kiểm tra mật khẩu xác nhận
        if(password !== repassword){
            return res.status(400).json({
                success:false,
                message:"Mật khẩu xác nhận không khớp"
            })
        }

        // kiểm tra email đã tồn tại chưa
        const existUser = await User.findOne({email})

        if(existUser){
            return res.status(400).json({
                success:false,
                message:"Email đã tồn tại"
            })
        }

        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công",
            data:{
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

//hàm tạo Admin
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password,repassword, phone } = req.body;
        if(password !== repassword){
            return res.status(400).json({
                success:false,
                message:"Mật khẩu xác nhận không khớp"
            });
        }
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "Email đã tồn tại"
            });
        }
        const user  = await User.create({
            name,
            email,
            password,
            phone,
            role: "admin"
        });
        res.status(201).json({
            success: true,
            message: "Tài khoản Admin đã được tạo thành công",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                
                role: user.role
            }
        
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
   

};

//tạo mã OTP (login b1)
export const sendOTP = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success:false,
                message:"Người dùng không tồn tại"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success:false,
                message:"Mật khẩu không chính xác"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000;

        await user.save();

        // gửi OTP qua Gmail
        await sendEmail(
            user.email,
            "Mã OTP đăng nhập",
            `Mã OTP của bạn là: ${otp}. OTP có hiệu lực trong 5 phút`
        );

        res.status(200).json({
            success:true,
            message:"OTP đã gửi tới Gmail"
        });

    } catch (error) {

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};


// Xác thực OTP và đăng nhập
export const verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await User.findOne({
            email,
            otp,
            otpExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Mã OTP không hợp lệ hoặc đã hết hạn",
            });
        }

        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Xác thực OTP thành công",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                }
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};