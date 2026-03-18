import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    tls: {
        rejectUnauthorized: false
    }

});


const sendEmail = async (to, subject, text) => {

    try {

        const mailOptions = {
            from: `"ChongThamBaoLinh" <${process.env.EMAIL_USER}>`,
            to: to,      // Phải là biến 'to' nhận từ tham số
            subject: subject,
            text: text   // Phải là biến 'text' nhận từ tham số
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.response);

    } catch (error) {

        console.error("Email error:", error);

        throw new Error("Không thể gửi email");

    }

};


export default sendEmail;