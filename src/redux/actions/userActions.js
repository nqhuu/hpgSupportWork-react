import actionTypes from './actionTypes'
import { getAllCodeService, getAllLocationService, getAllErrorCodeService } from '../../services/userService'


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
        reqItSupport: data
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



