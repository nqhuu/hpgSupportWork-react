import axios from "../axios";

const handleDataHome = (isDeparment, currentPage, currentLitmit) => {
    return axios.get(`/api/all-request?isDeparment=${isDeparment}&currentPage=${currentPage}&currentLitmit=${currentLitmit}`);
}

const handleLoginApi = (userName, password) => {
    return axios.post('/api/login', { userName, password }); //cách viết ngắn gọn theo kiểu Object Shorthand Notation , nơi JavaScript tự động hiểu rằng email và password trong đối tượng là các biến đã có với cùng tên.
}

const getAllUser = (id, departmentId) => {
    if (id) return axios.get(`/users/api/all-user?id=${id}`);
    return axios.get(`/users/api/all-user?departmentId=${departmentId}`);
}

export {
    handleLoginApi, handleDataHome, getAllUser
}