import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Nếu đã cài npm install cors
import connectDB from './src/config/db.js';
import productRoutes from './src/routes/productRoutes.js';
import authRoutes from './src/routes/authRoutes.js'; // Import route cho auth
dotenv.config();
connectDB();

const app = express();

// --- MIDDLEWARES (Phải đặt trước Routes) ---
app.use(cors()); // Cho phép gọi API từ bên ngoài
app.use(express.json()); // Giải mã JSON request body
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // Thêm route cho auth

app.get('/', (req, res) => {
  res.send('Server MERN của bạn đã sẵn sàng!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});