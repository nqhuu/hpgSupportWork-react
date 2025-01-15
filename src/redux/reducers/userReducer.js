
import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    reqSupport: [],
    allSupport: [],
    allLocation: [],
    allErrorCode: [],

}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.userInfo
            }
        case actionTypes.USER_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null
            }
        case actionTypes.PROCESS_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null
            }
        case actionTypes.GET_DATA_IT_REQ_SUCCESS:
            return {
                ...state,
                reqSupport: action.reqItSupport.reqSupport
            }
        case actionTypes.GET_DATA_IT_REQ_FAIL:
            return {
                ...state,
                reqSupport: []
            }
        case actionTypes.FETCH_ALL_REQUEST_SUCCESS:
            return {
                ...state,
                allSupport: action.allSupport
            }
        case actionTypes.FETCH_ALL_REQUEST_FAIL:
            return {
                ...state,
                allSupport: []
            }
        case actionTypes.FETCH_ALL_LOCATION_SUCCESS:
            return {
                ...state,
                allLocation: action.allLocation.listLocation
            }
        case actionTypes.FETCH_ALL_LOCATION_FAIL:
            return {
                ...state,
                allLocation: []
            }
        case actionTypes.FETCH_ALL_ERROR_CODE_SUCCESS:
            return {
                ...state,
                allErrorCode: action.allErrorCode.listErrorCode
            }
        case actionTypes.FETCH_ALL_ERROR_CODE_FAIL:
            return {
                ...state,
                allErrorCode: []
            }
        default:
            return state;
    }
}





export default userReducer;