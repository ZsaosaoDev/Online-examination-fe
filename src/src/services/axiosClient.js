import axios from 'axios';

// 1. Cấu hình mặc định
const axiosClient = axios.create({
  // Điền link gốc API Backend của bạn vào đây
  baseURL: process.env.REACT_APP_API_URL || 'https://unwifely-pamella-interrailway.ngrok-free.dev/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


// 2. Can thiệp trước khi gửi Request (Gắn Token nếu có)
axiosClient.interceptors.request.use(
  (config) => {
    // Nếu có token lưu trong localStorage thì tự động gắn vào đây
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Can thiệp sau khi nhận Response từ Backend
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về thẳng data để bên ngoài không cần gọi response.data.data
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Bắt lỗi chung (VD: Hết hạn token thì văng ra trang login)
    console.error("Lỗi API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;