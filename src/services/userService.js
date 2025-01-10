import axios from "../axios";

const handleDataHome = () => {
    return axios.get('/api/all-data-home');
}

const handleLoginApi = (userName, password) => {
    return axios.post('/api/login', { userName, password }); //cách viết ngắn gọn theo kiểu Object Shorthand Notation , nơi JavaScript tự động hiểu rằng email và password trong đối tượng là các biến đã có với cùng tên.
}


export {
    handleLoginApi, handleDataHome
}