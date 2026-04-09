import axiosClient from './axiosClient';

const evaluationApi = {
    submitExam: (data) => {
        return axiosClient.post('/evaluations/submit', data);
    },
    getMyAttempts: () => {
        return axiosClient.get('/evaluations/attempts');
    },
    getExamAttempts: (examId) => {
        return axiosClient.get(`/evaluations/exam/${examId}/attempts`);
    },
    getMyAttemptByExam: (examId) => {
        return axiosClient.get(`/evaluations/exam/${examId}/my-attempt`);
    }
};

export default evaluationApi;
