import express from 'express';
import { getProducts, createProduct,updateProduct, deleteProduct, getProductDetails } from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();


// Cấu hình lưu trữ tạm thời (Memory storage là tốt nhất nếu bạn định up lên Cloudinary sau đó)
const upload = multer({ storage: multer.memoryStorage() });

// Thêm upload.array('images') vào đây
router.route('/')
  .post(protect, admin, upload.array('images'), createProduct) 
  .get(getProducts);

router.route('/:id')
  .get(getProductDetails)
  .put(protect, admin, upload.array('images'), updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;


