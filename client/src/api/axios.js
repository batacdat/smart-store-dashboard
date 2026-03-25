import axios from 'axios';
axios.defaults.withCredentials = true;
const instance = axios.create({
  baseURL: '/api',
  withCredentials: true, // Quan trọng: Để gửi và nhận Cookie từ Backend
});

// Use Case: Làm mới Token tự động
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Nếu lỗi 401 (Hết hạn Access Token) và chưa thử refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.get('/auth/refresh-token', { withCredentials: true });
        
        return instance(originalRequest); // Gửi lại request ban đầu
      } catch (refreshError) {
        window.location.href = '/login'; // Refresh lỗi thì bắt login lại
      }
    }
    return Promise.reject(error);
  }
);

export default instance;