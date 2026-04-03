import axiosClient from "./axiosClient";

const userApi = {
    getUserProfile: () => axiosClient.get("/user/profile"),
    updateUser: (data) => axiosClient.put("/user/update", data),

};

export default userApi;
