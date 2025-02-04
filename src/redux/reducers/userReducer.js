
import actionTypes from '../actions/actionTypes';
import { VALUE } from '../../ultil/constant';
import { getAllPersonnel } from '../../services/userService';

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    reqSupportIt: [],
    reqSupportCd: [],
    allSupport: [],
    allLocation: [],
    allErrorCode: [],
    allPersonnel: [],
    allSelectPersonnel: [],
    allPersonnelExtra: []

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
            if (action.reqSupport.isDeparment === VALUE.NOT_YET_COMPLETE_CD) {
                return {
                    ...state,
                    reqSupportCd: action.reqSupport.reqSupport
                }
            }
            return {
                ...state,
                reqSupportIt: action.reqSupport.reqSupport
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
        case actionTypes.FETCH_ALL_PERSONNEL_SUCCESS:
            return {
                ...state,
                allPersonnel: action.allPersonnel
            }
        case actionTypes.FETCH_ALL_PERSONNEL_FAIL:
            return {
                ...state,
                allPersonnel: []
            }
        case actionTypes.FETCH_ALL_SELECT_PERSONNEL_SUCCESS:
            return {
                ...state,
                allSelectPersonnel: action.allSelectPersonnel
            }
        case actionTypes.FETCH_ALL_SELECT_PERSONNEL_FAIL:
            return {
                ...state,
                allSelectPersonnel: []
            }
        case actionTypes.FETCH_ALL_SELECT_PERSONNEL_EXTRA_SUCCESS:
            return {
                ...state,
                allPersonnelExtra: action.allPersonnelExtra
            }
        case actionTypes.FETCH_ALL_SELECT_PERSONNEL_EXTRA_FAIL:
            return {
                ...state,
                allPersonnelExtra: []
            }

        default:
            return state;
    }
}






export default userReducer;