
import actionTypes from '../actions/actionTypes';

const initialState = {
    allDevices: [],
}

const managerReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ALL_DEVICES_SUCCESS:
            return {
                ...state,
                allDevices: action.allDevices
            }
        case actionTypes.FETCH_ALL_DEVICES_FAIL:
            return {
                ...state,
                allDevices: []
            }
        default:
            return state;
    }
}


export default managerReducer;