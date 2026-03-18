import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, "Vui lòng nhập tên người dùng"],
        trim: true,
        maxLength: [30, "Tên không được vượt quá 30 ký tự"],
    },

    email: {
        type: String,
        unique: true,
        sparse: true, // Thêm sparse: true để cho phép nhiều user có email là null/undefined
        validate: [validator.isEmail, "Vui lòng nhập đúng định dạng email"],
    },
    password: {
        type: String,
        required: [true, "Vui lòng nhập mật khẩu"],
        minLength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
        select: false,
    },

    phone: {
        type: String,
        required: [true, "Vui lòng nhập số điện thoại"],
        validate: {
            validator: function (v) {
                return /(03|05|07|08|09)+([0-9]{8})\b/.test(v);
            },
            message: (props) =>
                `${props.value} không phải là số điện thoại hợp lệ!`,
        },
    },

    role: {
        type: String,
        default: "customer",
        enum: ["customer", "admin"],
    },

    refreshToken: {
        type: String,
    },

    otp: {
        type: String,
    },

    otpExpire: {
        type: Date,
    },
},
{
    timestamps: true,
}
);


// Hash password trước khi lưu
userSchema.pre("save", async function () {

    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);

});

const User = mongoose.model("User", userSchema);

export default User;