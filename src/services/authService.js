import axiosClient from './axiosClient';

export const authService = {
  register: (payload) => axiosClient.post('/auth/register', payload),
  login: (payload) => axiosClient.post('/auth/login', payload),
  verifyEmail: (token) => axiosClient.get(`/auth/verify?token=${token}`),
  getProfile: () => axiosClient.get('/auth/profile'),
};