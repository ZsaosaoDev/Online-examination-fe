import axios from "axios";

const API_URL = "http://localhost:8081/api/v1";

const axiosClient = axios.create({
    baseURL: API_URL, // Thay bằng API thật của bạn
    headers: {
        "Content-Type": "application/json",
    },
    // withCredentials: true,  // send cookies when cross-domain requests
});

// Thêm token vào request nếu user đã đăng nhập

// axiosClient.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export default axiosClient;