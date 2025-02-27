import axios from "../axios";

const getAllDeviceByDepartment = (mngDepartmentId, limit, currentPage) => {
    if (mngDepartmentId) return axios.get(`/device/api/all-device?mngDepartmentId=${mngDepartmentId}&limit=${limit}&currentPage=${currentPage}`);
}

export {
    getAllDeviceByDepartment
}

