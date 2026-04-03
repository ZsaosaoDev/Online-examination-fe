import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://unwifely-pamella-interrailway.ngrok-free.dev/api', 
  withCredentials: true, // QUAN TRỌNG: Để nhận và gửi Cookie
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // QUAN TRỌNG: Bỏ qua trang cảnh báo của ngrok
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => (response && response.data ? response.data : response),
  (error) => {
    console.error("Lỗi API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;