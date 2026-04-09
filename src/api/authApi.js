import axiosClient from "./axiosClient";

const authApi = {
    login: (data) => axiosClient.post("/auth/login", data),
    register: (data) => axiosClient.post("/auth/register", data),
    verifyEmail: (token) => axiosClient.get(`/auth/verify?token=${token}`),
    logout: () => axiosClient.post("/auth/logout"),
};

export default authApi;