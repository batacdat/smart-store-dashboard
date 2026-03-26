import express from 'express';
import { getAllOrders, getSingleOrder, createOrder } from '../controllers/orderController.js';
const router = express.Router();

// Giả sử bạn đã có middleware kiểm tra quyền Admin
// const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Route lấy tất cả đơn hàng: GET /api/admin/orders
router.route('/').get(getAllOrders).post(createOrder);

// Route lấy chi tiết 1 đơn hàng: GET /api/admin/order/:id
router.route('/:id').get(getSingleOrder);


export default router;