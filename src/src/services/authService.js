import axiosClient from './axiosClient';
export const authService = {
  // Hàm Đăng ký
  register: (payload) => {
    const url = '/auth/register'; // Đường dẫn API đăng ký
    return axiosClient.post(url, payload);
  },

  // Hàm Đăng nhập 
  login: (payload) => {
    const url = '/auth/login'; // Đường dẫn API đăng nhập
    return axiosClient.post(url, payload);
  },

  // Hàm lấy thông tin user hiện tại (ví dụ)
  getProfile: () => {
    const url = '/auth/profile';
    return axiosClient.get(url);
  },
  verifyEmail: (token) => {
    // BE của bạn yêu cầu truyền qua param: /auth/verify?token=...
    const url = `/auth/verify?token=${token}`; 
    return axiosClient.get(url); 
  }
};