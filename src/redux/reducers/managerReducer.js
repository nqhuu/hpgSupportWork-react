
import actionTypes from '../actions/actionTypes';

const initialState = {
    allDevices: [],
    allVendors: [],
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

        case actionTypes.FETCH_ALL_VENDOR_SUCCESS:
            return {
                ...state,
                allVendors: action.allVendors
            }
        case actionTypes.FETCH_ALL_VENDOR_FAIL:
            return {
                ...state,
                allVendors: []
            }
        default:
            return state;
    }
}



export default managerReducer;