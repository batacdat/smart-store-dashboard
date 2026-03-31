import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

// ❌ KHÔNG thêm token vào header khi dùng cookie
instance.interceptors.request.use(
  (config) => {
  //  console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    // Không thêm Authorization header vì đã dùng cookie
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor xử lý refresh token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Cookie sẽ tự động được gửi trong request này
        await instance.get('/auth/refresh-token');
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;