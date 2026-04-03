import axiosClient from "./axiosClient";

const authApi = {
    login: (data) => axiosClient.post("/auth/login", data),
    register: (formData) => axiosClient.post("/participant", formData, {
        headers: {
            "Content-Type": "multipart/form-data",  // Important upload file
        }
    }),
    logout: () => axiosClient.post("/auth/logout"),
};

export default authApi;