import axios from 'axios';

const API = axios.create({
    // Nếu vite.config.js đã cấu hình proxy cho /api, bạn chỉ cần để như sau:
    baseURL: '/api', 
    withCredentials: true 
});

// Khớp với router.route('/').post(...) trong productRoutes.js của bạn
export const createProduct = (formData) => API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const getAllProducts = () => API.get('/products');
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const updateProduct = (id, formData) => API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});