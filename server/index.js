import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import productRoutes from './src/routes/productRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import cookieParser from "cookie-parser";
import cloudinary from './src/config/cloudinary.js';
import contactRoutes from './src/routes/contactRoutes.js';
import blogRoutes from './src/routes/blogRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';

dotenv.config();
connectDB();

const app = express();

// 1. TẠO HTTP SERVER VÀ CẤU HÌNH SOCKET.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000', '*', 'https://smart-store-dashboard-rosy.vercel.app','https://chongthambaolinh.com.vn'], // Thêm các origin nếu cần
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },
    // Tùy chọn thêm để tăng performance
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
});

// Middleware để truyền instance io vào các request (giúp các route/controller có thể dùng socket)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- MIDDLEWARES ---
app.use(cors({
    origin: ['*', 'http://localhost:5173', 'http://localhost:3000', 'https://smart-store-dashboard-rosy.vercel.app','https://chongthambaolinh.com.vn'], // Cho phép tất cả origin hoặc chỉ định cụ thể
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// --- SOCKET.IO EVENTS ---
// Lưu trữ danh sách người dùng đang online
global.onlineUsers = new Map();
// Lưu trữ danh sách admin đang online
global.onlineAdmins = new Set();

io.on("connection", (socket) => {
    console.log("🔌 A user connected:", socket.id);

    // Lắng nghe khi người dùng thông báo danh tính (userId)
    socket.on("register-user", (userId) => {
        if (userId) {
            global.onlineUsers.set(userId, socket.id);
            console.log(`✅ User ${userId} registered with socket ${socket.id}`);
            console.log(`📊 Online users: ${global.onlineUsers.size}`);
        }
    });

    // Lắng nghe khi admin đăng nhập
    socket.on("register-admin", (adminId) => {
        if (adminId) {
            global.onlineAdmins.add(socket.id);
            socket.adminId = adminId;
            console.log(`👑 Admin ${adminId} registered with socket ${socket.id}`);
            console.log(`📊 Online admins: ${global.onlineAdmins.size}`);
        }
    });

    // Admin join vào room admin để nhận thông báo
    socket.on("admin-join", () => {
        socket.join("admin-room");
        console.log(`👑 Admin joined admin-room: ${socket.id}`);
    });

    // User join vào room của riêng mình
    socket.on("user-join", (userId) => {
        if (userId) {
            socket.join(`user-${userId}`);
            console.log(`👤 User ${userId} joined their personal room`);
        }
    });

    // Xử lý disconnect
    socket.on("disconnect", () => {
        console.log("🔌 User disconnected:", socket.id);
        
        // Xóa người dùng khỏi danh sách online users
        for (let [userId, socketId] of global.onlineUsers.entries()) {
            if (socketId === socket.id) {
                global.onlineUsers.delete(userId);
                console.log(`❌ User ${userId} removed from online list`);
                break;
            }
        }
        
        // Xóa admin khỏi danh sách online admins
        if (global.onlineAdmins.has(socket.id)) {
            global.onlineAdmins.delete(socket.id);
            console.log(`❌ Admin removed from online list`);
            console.log(`📊 Remaining online admins: ${global.onlineAdmins.size}`);
        }
    });

    // Xử lý lỗi socket
    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });
});

// Thêm middleware để log các kết nối socket
io.use((socket, next) => {
    console.log(`🔄 New socket connection attempt: ${socket.id}`);
    next();
});

// --- ROUTES ---
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime(),
        socketConnections: io.engine.clientsCount,
        onlineUsers: global.onlineUsers.size,
        onlineAdmins: global.onlineAdmins.size
    });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;

// QUAN TRỌNG: Đổi từ app.listen thành httpServer.listen
httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 Socket.IO server is ready`);
    console.log(`🌐 CORS enabled for: http://localhost:5173, http://localhost:3000`);
});

// Xuất io để sử dụng ở các file khác nếu cần
export { io, httpServer };