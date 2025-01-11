import axios from "../axios";
import { VALUE } from "../ultil/constant";

const handleDataHome = (isDeparment, currentPage, currentLitmit) => {
    // if (isDeparment === VALUE.IT_HOME) 
    return axios.get(`/api/all-request?isDeparment=${isDeparment}&currentPage=${currentPage}&currentLitmit=${currentLitmit}`);
    // return axios.get(`/api/all-request-cd?isDeparment=${isDeparment}&currentPage=${currentPage}&currentLitmit=${currentLitmit}`);
}

const handleLoginApi = (userName, password) => {
    return axios.post('/api/login', { userName, password }); //cách viết ngắn gọn theo kiểu Object Shorthand Notation , nơi JavaScript tự động hiểu rằng email và password trong đối tượng là các biến đã có với cùng tên.
}


export {
    handleLoginApi, handleDataHome
}