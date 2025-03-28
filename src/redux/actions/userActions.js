import actionTypes from './actionTypes'
import {
    getAllCodeService, getAllLocationService, getAllErrorCodeService,
    getAllPersonnel, getAllPersonnelExtra, getAllDepartment,
    getAllUser
} from '../../services/userService'
import { getAllPersonnelReport } from '../../services/HrService'


export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})

export const userLoginSuccess = (userInfo) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo
})

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL
})

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT
})

export const handleDataHomeRedux = (data) => (
    {
        type: actionTypes.GET_DATA_IT_REQ_SUCCESS,
        reqSupport: data
    }
)


export const getAllSupport = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_REQUEST_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let listType = await getAllCodeService('GRTYPE')
            let listSotfware = await getAllCodeService('SOFTWARE')
            let listTypeDevice = await getAllCodeService('GRDEVICE')
            let listPriority = await getAllCodeService('PRIORITY')

            let response = {
                listType: listType.data,
                listSotfware: listSotfware.data,
                listTypeDevice: listTypeDevice.data,
                listPriority: listPriority.data
            }

            if (response) {
                // console.log(response)
                dispatch(getAllSupportSuccess(response))
            }
            else {
                dispatch(getAllSupportFailed())
            }
        } catch (e) {
            dispatch(getAllSupportFailed())
            console.log('getRequiredDoctorInfor error', e)
        }
    }
}

export const getAllSupportSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_REQUEST_SUCCESS,
    allSupport: data
})

export const getAllSupportFailed = () => ({
    type: actionTypes.FETCH_ALL_REQUEST_FAIL
})

export const getAllSelectPersonnelRedux = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_SELECT_PERSONNEL_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let listTime = await getAllCodeService('TIME')
            let listStatusUserReport = await getAllCodeService('STUSERREPORT')

            let response = {};
            if (listTime && listTime.errCode === 0) {
                response.listTime = listTime.data
            }
            if (listStatusUserReport && listStatusUserReport.errCode === 0) {
                response.listStatusUserReport = listStatusUserReport.data
            }


            if (response) {
                // console.log(response)
                dispatch(getAllSelectPersonneSuccess(response))
            }
            else {
                dispatch(getAllSelectPersonneFailed())
            }
        } catch (e) {
            dispatch(getAllSelectPersonneFailed())
            console.log('getAllSelectPersonnelRedux error', e)
        }
    }
}

export const getAllSelectPersonneSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_SELECT_PERSONNEL_SUCCESS,
    allSelectPersonnel: data
})

export const getAllSelectPersonneFailed = () => ({
    type: actionTypes.FETCH_ALL_SELECT_PERSONNEL_FAIL
})

export const getAllLocation = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_LOCATION_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let listLocation = await getAllLocationService()


            let response = {
                listLocation: listLocation.data
            }

            if (response) {
                dispatch(getAllLocationSuccess(response))
            }
            else {
                dispatch(getAllLocationFailed())
            }
        } catch (e) {
            dispatch(getAllLocationFailed())
            console.log('getRequiredDoctorInfor error', e)
        }
    }
}

export const getAllLocationSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_LOCATION_SUCCESS,
    allLocation: data
})

export const getAllLocationFailed = () => ({
    type: actionTypes.FETCH_ALL_LOCATION_FAIL
})

export const getAllErrorCode = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_ERROR_CODE_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let listErrorCode = await getAllErrorCodeService()


            let response = {
                listErrorCode: listErrorCode.data
            }

            if (response) {
                dispatch(getAllErrorCodeSuccess(response))
            }
            else {
                dispatch(getAllErrorCodeFailed())
            }
        } catch (e) {
            dispatch(getAllErrorCodeFailed())
            console.log('getRequiredDoctorInfor error', e)
        }
    }
}

export const getAllErrorCodeSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_ERROR_CODE_SUCCESS,
    allErrorCode: data
})

export const getAllErrorCodeFailed = () => ({
    type: actionTypes.FETCH_ALL_ERROR_CODE_FAIL
})


export const getAllPersonnelRedux = (dataDay, shiftId, departmentId) => {

    if (!shiftId) shiftId = '';
    if (!departmentId) departmentId = '';
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_PERSONNEL_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let listPersonnel = await getAllPersonnel(dataDay, shiftId, departmentId)
            let response = {
                listPersonnel: listPersonnel.data
            }
            if (response) {
                dispatch(getAllPersonnelReduxSuccess(response))
            }
            else {
                dispatch(getAllPersonnelReduxFailed())
            }
        } catch (e) {
            dispatch(getAllPersonnelReduxFailed())
            console.log('getAllPersonnelReduxFailed error', e)
        }
    }
}

export const getAllPersonnelReduxSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_PERSONNEL_SUCCESS,
    allPersonnel: data.listPersonnel
})

export const getAllPersonnelReduxFailed = () => ({
    type: actionTypes.FETCH_ALL_PERSONNEL_FAIL,
})

export const getAllPersonnelExtraRedux = (dataDay, shiftId, departmentId) => {

    if (!shiftId) shiftId = '';
    if (!departmentId) departmentId = '';
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_SELECT_PERSONNEL_EXTRA_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let listPersonnelExtra = await getAllPersonnelExtra(dataDay, shiftId, departmentId)
            let response = {
                listPersonnelExtra: listPersonnelExtra.data
            }
            if (response) {
                dispatch(getAllPersonnelExtraReduxSuccess(response))
            }
            else {
                dispatch(getAllPersonnelExtraReduxFailed())
            }
        } catch (e) {
            dispatch(getAllPersonnelExtraReduxFailed())
            console.log('getAllPersonnelExtraReduxFailed error', e)
        }
    }
}

export const getAllPersonnelExtraReduxSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_SELECT_PERSONNEL_EXTRA_SUCCESS,
    allPersonnelExtra: data.listPersonnelExtra
})

export const getAllPersonnelExtraReduxFailed = () => ({
    type: actionTypes.FETCH_ALL_SELECT_PERSONNEL_EXTRA_FAIL,
})

export const getAllDepartmentRedux = () => {

    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_DEPARTMENT_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let listDeparment = await getAllDepartment()
            if (listDeparment && listDeparment.errCode === 0) {
                dispatch(getAllDepartmentReduxSuccess(listDeparment.data))
            }
            else {
                dispatch(getAllDepartmentReduxFailed())
            }
        } catch (e) {
            dispatch(getAllDepartmentReduxFailed())
            console.log('getAllDepartmentReduxFailed error', e)
        }
    }
}

export const getAllDepartmentReduxSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_DEPARTMENT_SUCCESS,
    allDepartment: data
})

export const getAllDepartmentReduxFailed = () => ({
    type: actionTypes.FETCH_ALL_DEPARTMENT_FAIL,
})

export const dayOrNight = (dayOrNight) => ({
    type: actionTypes.IS_DAY_OR_NIGHT_SUCCESS,
    dayOrNight: dayOrNight
})

export const dayOrNightfail = () => ({
    type: actionTypes.IS_DAY_OR_NIGHT_FAIL,
})


export const getAllPersonnelReportRedux = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_DAY_PESSONEL_REPORT_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let allReport = await getAllPersonnelReport({ day: 'toDay' })
            if (allReport && allReport.errCode === 0) {
                dispatch(getAllPersonnelReportSuccess(allReport.data))
            }
            else {
                dispatch(getAllPersonnelReportFailed())
            }
        } catch (e) {
            dispatch(getAllPersonnelReportFailed())
            console.log('getAllPersonnelReportFailed error', e)
        }
    }
}

export const getAllPersonnelReportSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_DAY_PESSONEL_REPORT_SUCCESS,
    allReport: data
})

export const getAllPersonnelReportFailed = () => ({
    type: actionTypes.FETCH_ALL_DAY_PESSONEL_REPORT_FAIL,
})


export const getAllPersonnelReportInMonthRedux = (dataDay) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_MONTH_PESSONEL_REPORT_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let allReport = await getAllPersonnelReport({ fromDate: dataDay.firstDayOfMonth, toDate: dataDay.firstDayOfNextMonth })
            if (allReport && allReport.errCode === 0) {
                dispatch(getAllPersonnelReportInMonthSuccess(allReport.data))
            }
            else {
                dispatch(getAllPersonnelReportInMonthFailed())
            }
        } catch (e) {
            dispatch(getAllPersonnelReportInMonthFailed())
            console.log('getAllPersonnelReportInMonthFailed error', e)
        }
    }
}

export const getAllPersonnelReportInMonthSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_MONTH_PESSONEL_REPORT_SUCCESS,
    allReportInMonth: data
})

export const getAllPersonnelReportInMonthFailed = () => ({
    type: actionTypes.FETCH_ALL_MONTH_PESSONEL_REPORT_FAIL,
})






export const getAllUserRedux = (dataDay) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_USER_START }) // để phát đi 1 action báo hiệu quá trình lấy dữ liệu bắt đầu
            let allUserDb = await getAllUser()
            if (allUserDb && allUserDb.errCode === 0) {
                dispatch(getAllUserSuccess(allUserDb.data))
            }
            else {
                dispatch(getAllUserFailed())
            }
        } catch (e) {
            dispatch(getAllUserFailed())
            console.log('getAllUserFailed error', e)
        }
    }
}

export const getAllUserSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    allUser: data
})

export const getAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAIL,
})








