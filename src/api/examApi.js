import axiosClient from './axiosClient';

const examApi = {
    createExam: (data) => {
        return axiosClient.post('/exams', data);
    },
    getTeacherExams: () => {
        return axiosClient.get('/exams/teacher');
    },
    getExamById: (id) => {
        return axiosClient.get(`/exams/${id}`);
    },
    deleteExam: (id) => {
        return axiosClient.delete(`/exams/${id}`);
    },
    assignToClassrooms: (examId, data) => {
        return axiosClient.post(`/exams/${examId}/assignments`, data);
    },
    toggleVisibility: (examId, showResults) => {
        return axiosClient.patch(`/exams/${examId}/visibility?showResults=${showResults}`);
    },
    getStudentExams: () => {
        return axiosClient.get('/exams/student');
    }
};

export default examApi;
