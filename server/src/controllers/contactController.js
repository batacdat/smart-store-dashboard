import nodemailer from 'nodemailer';

export const sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // Cấu hình transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Nội dung Email
        const mailOptions = {
            from: `"${name}" <${email}>`, // Hiển thị tên khách hàng
            to: process.env.EMAIL_RECEIVER, // Gửi đến bạn
            subject: `[Liên hệ Web] ${subject}`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">Yêu cầu liên hệ mới</h2>
                    <p><strong>Khách hàng:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Chủ đề:</strong> ${subject}</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 10px;">
                        <strong>Lời nhắn:</strong><br/>
                        ${message.replace(/\n/g, '<br/>')}
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Tin nhắn đã được gửi tới bộ phận hỗ trợ!",
        });
    } catch (error) {
        console.error("Nodemailer Error:", error);
        res.status(500).json({
            success: false,
            message: "Không thể gửi email lúc này. Vui lòng thử lại sau.",
        });
    }
};