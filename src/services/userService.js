import axios from "../axios";

const handleDataRequestSupport = (isDeparment, currentPage, currentLitmit, userId) => {
    if (userId) {
        return axios.get(`/api/all-request?isDeparment=${isDeparment}&currentPage=${currentPage}&currentLitmit=${currentLitmit}&userInfo=${userId}`);
    } else {
        return axios.get(`/api/all-request?isDeparment=${isDeparment}&currentPage=${currentPage}&currentLitmit=${currentLitmit}`);
    }
}

const handleLoginApi = (userName, password) => {
    return axios.post('/api/login', { userName, password }); //cách viết ngắn gọn theo kiểu Object Shorthand Notation , nơi JavaScript tự động hiểu rằng email và password trong đối tượng là các biến đã có với cùng tên.
}

const getAllUser = (id, departmentId) => {
    if (id) return axios.get(`/users/api/all-user?id=${id}`);
    return axios.get(`/users/api/all-user?departmentId=${departmentId}`);
}

const getAllCodeService = (inputType) => {
    return axios.get(`/users/api/allcode?type=${inputType}`)
}

const getAllLocationService = () => {
    return axios.get(`/users/api/all-location`)
}

const getAllErrorCodeService = () => {
    return axios.get(`/users/api/all-errorCode`)

}

const uploadsFile = (task, formData) => {
    return axios.post(`/uploads?task=${task}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }); //upload 1 file 
}

const handleCreateRequest = (data, request) => {
    return axios.post(`/users/api/create-request-support`, { data, request })
}

const updateRequestSupport = (data) => {
    return axios.post(`/users/api/update-request-support`, data)
}

export {
    handleLoginApi, handleDataRequestSupport, getAllUser, getAllCodeService, getAllLocationService,
    getAllErrorCodeService, uploadsFile, handleCreateRequest, updateRequestSupport

}

