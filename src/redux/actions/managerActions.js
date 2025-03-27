import actionTypes from './actionTypes'
import { getAllDeviceByDepartment, getAllVendorDevices } from '../../services/managerService'


export const getAllDeviceByDepartmentredux = (mngDepartmentId, limit, currentPage, search) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_DEVICES_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let allDevices = await getAllDeviceByDepartment(mngDepartmentId, limit, currentPage, search)
            if (allDevices && allDevices.errCode === 0) {
                dispatch(getAllDeviceByDepartmentSuccess(allDevices.data))
            }
            else {
                dispatch(getAllDeviceByDepartmentFailed())
            }
        } catch (e) {
            dispatch(getAllDeviceByDepartmentFailed())
            console.log('getAllDeviceByDepartmentFailed error', e)
        }
    }
}

export const getAllDeviceByDepartmentSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_DEVICES_SUCCESS,
    allDevices: data
})

export const getAllDeviceByDepartmentFailed = () => ({
    type: actionTypes.FETCH_ALL_DEVICES_FAIL,
})





export const getAllVendorRedux = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_VENDOR_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let allVendors = await getAllVendorDevices()
            if (allVendors && allVendors.errCode === 0) {
                dispatch(getAllVendorSuccess(allVendors.data))
            }
            else {
                dispatch(getAllVendorFailed())
            }
        } catch (e) {
            dispatch(getAllVendorFailed())
            console.log('getAllDeviceByDepartmentFailed error', e)
        }
    }
}

export const getAllVendorSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_VENDOR_SUCCESS,
    allVendors: data
})

export const getAllVendorFailed = () => ({
    type: actionTypes.FETCH_ALL_VENDOR_FAIL,
})











