import express from 'express';
import { getProducts, createProduct,updateProduct, deleteProduct } from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.route('/').post(protect, admin, createProduct).get(getProducts);
router.route('/:id').put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
export default router;