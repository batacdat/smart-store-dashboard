import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config();

// Khởi tạo Resend với API Key lấy từ biến môi trường trên Render
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Hàm gửi email sử dụng Resend API (Thay thế Nodemailer)
 * @param {string} to - Email người nhận
 * @param {string} subject - Tiêu đề email
 * @param {string} text - Nội dung mã OTP hoặc thông báo
 */
const sendEmail = async (to, subject, text) => {
    try {
        const { data, error } = await resend.emails.send({
            // Sử dụng tên miền đã được xác thực thành công của bạn
            from: 'ChongThamBaoLinh <no-reply@chongthambaolinh.com.vn>',
            to: to,
            subject: subject,
            // Gửi dưới dạng HTML để hiển thị chuyên nghiệp hơn
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee">
                    <h2 style="color: #333;">Mã xác thực từ Hệ thống Quản trị</h2>
                    <p style="font-size: 16px;">Nội dung: <strong>${text}</strong></p>
                    <p style="color: #777; font-size: 12px; margin-top: 20px;">
                        Đây là email tự động, vui lòng không phản hồi.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error("Lỗi từ Resend API:", error);
            throw new Error("Không thể gửi email qua Resend");
        }

        console.log("Email đã được gửi thành công. ID:", data.id);
        return data;

    } catch (error) {
        console.error("Lỗi hệ thống gửi email:", error.message);
        throw new Error("Lỗi hệ thống: Không thể hoàn thành tác vụ gửi email");
    }
};

export default sendEmail;