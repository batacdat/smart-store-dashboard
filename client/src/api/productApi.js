import api from '../api/axios';

export const updateProduct = (id, formData) => {
  console.log('Updating product with cookie auth');
  return api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    // withCredentials đã được cấu hình trong axios instance
  });
};

export const createProduct = (formData) => {
  return api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAllProducts = () => api.get('/products');
export const deleteProduct = (id) => api.delete(`/products/${id}`);