import axios from "../axios";

const getAllPersonnelReport = (dataDay) => {
    if (dataDay.day) return axios.get(`/hr/api/all-personnel-report?day=${dataDay.day}`);
    if (dataDay.fromDate && dataDay.toDate) return axios.get(`/hr/api/all-personnel-report?fromDate=${dataDay.fromDate}&toDate=${dataDay.toDate}`);
}



export {
    getAllPersonnelReport
}

