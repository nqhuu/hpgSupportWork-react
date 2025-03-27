import axios from "../axios";
import _ from 'lodash'

const getAllDeviceByDepartment = (mngDepartmentId, limit, currentPage, search) => {
    if (_.isEmpty(search)) return axios.get(`/device/api/all-device?mngDepartmentId=${mngDepartmentId}&limit=${limit}&currentPage=${currentPage}`);
    return axios.get(`/device/api/all-device?mngDepartmentId=${mngDepartmentId}&limit=${limit}&currentPage=${currentPage}&search=${search}`);
}

const createDevices = (data) => {
    return axios.post('/device/api/create-devices', data)
}

const getAllVendorDevices = () => {
    return axios.get('/device/api/all-vendors')
}

export {
    getAllDeviceByDepartment, createDevices, getAllVendorDevices
}

