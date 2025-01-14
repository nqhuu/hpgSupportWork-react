
import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    reqSupport: []
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
        default:
            return state;
    }
}

export default userReducer;