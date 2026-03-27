// orderRoutes.js
import express from 'express';
import { protect, admin, checkOwnerOrAdmin } from '../middleware/authMiddleware.js';
import { 
    getAllOrders, 
    getSingleOrder, 
    createOrder,
    getMyOrders,
    updateOrderStatus,
    updatePaymentStatus, // <--- Bổ sung hàm này
    cancelOrder,
    getOrderStats
} from '../controllers/orderController.js';

const router = express.Router();

/* ==========================================
   ROUTES CHO NGƯỜI DÙNG (USER)
   ========================================== */

router.route('/')
    .post(protect, createOrder);  // Tạo đơn hàng

router.route('/myorders')
    .get(protect, getMyOrders);  // Xem danh sách đơn của tôi

router.route('/:id/cancel')
    .put(protect, cancelOrder);   // Người dùng tự hủy đơn hàng (khi chưa giao)


/* ==========================================
   ROUTES CHUNG (USER & ADMIN)
   ========================================== */

router.route('/:id')
    .get(protect, checkOwnerOrAdmin, getSingleOrder); // Xem chi tiết 1 đơn hàng


/* ==========================================
   ROUTES CHO QUẢN TRỊ VIÊN (ADMIN)
   ========================================== */

// 1. Lấy tất cả đơn hàng hệ thống & Thống kê
router.route('/admin/orders')
    .get(protect, admin, getAllOrders);

router.route('/admin/stats')
    .get(protect, admin, getOrderStats);

// 2. Cập nhật trạng thái đơn hàng (Xử lý đơn: Chờ xác nhận -> Đang giao...)
router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

// 3. Cập nhật trạng thái thanh toán (Xác nhận tiền về: Chưa thanh toán -> Đã thanh toán)
router.route('/:id/payment')
    .put(protect, admin, updatePaymentStatus); // <--- ĐƯỜNG DẪN MỚI CHO HÀM BẠN VỪA GỬI


export default router;