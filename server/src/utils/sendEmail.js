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

            from: `"Smart Store" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text

        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.response);

    } catch (error) {

        console.error("Email error:", error);

        throw new Error("Không thể gửi email");

    }

};


export default sendEmail;