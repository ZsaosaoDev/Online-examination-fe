import axiosClient from './axiosClient';

const classroomApi = {
    createClassroom: (data) => {
        return axiosClient.post('/classrooms', data);
    },
    getTeacherClassrooms: () => {
        return axiosClient.get('/classrooms/teacher');
    },
    inviteStudent: (classId, email) => {
        return axiosClient.post(`/classrooms/${classId}/invite`, { email });
    },
    joinClassroom: (token) => {
        return axiosClient.post(`/classrooms/join?token=${token}`);
    },
    getMembers: (classId) => {
        return axiosClient.get(`/classrooms/${classId}/members`);
    }
};

export default classroomApi;
