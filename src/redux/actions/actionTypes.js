const actionTypes = Object.freeze({
    //app
    APP_START_UP_COMPLETE: 'APP_START_UP_COMPLETE',
    SET_CONTENT_OF_CONFIRM_MODAL: 'SET_CONTENT_OF_CONFIRM_MODAL',
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
    //user
    ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',

    IS_DAY_OR_NIGHT_SUCCESS: 'IS_DAY_OR_NIGHT_SUCCESS',
    IS_DAY_OR_NIGHT_FAIL: 'IS_DAY_OR_NIGHT_FAIL',

    USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
    USER_LOGIN_FAIL: 'USER_LOGIN_FAIL',
    PROCESS_LOGOUT: 'PROCESS_LOGOUT',

    GET_DATA_IT_REQ_SUCCESS: 'GET_DATA_IT_REQ_SUCCESS',
    GET_DATA_IT_REQ_FAIL: 'GET_DATA_IT_REQ_FAIL',


    FETCH_ALL_REQUEST_START: 'FETCH_ALL_REQUEST_START',
    FETCH_ALL_REQUEST_SUCCESS: 'FETCH_ALL_REQUEST_SUCCESS',
    FETCH_ALL_REQUEST_FAIL: 'FETCH_ALL_REQUEST_FAIL',

    FETCH_ALL_LOCATION_START: 'FETCH_ALL_LOCATION_START',
    FETCH_ALL_LOCATION_SUCCESS: 'FETCH_ALL_LOCATION_SUCCESS',
    FETCH_ALL_LOCATION_FAIL: 'FETCH_ALL_LOCATION_FAIL',

    FETCH_ALL_ERROR_CODE_START: 'FETCH_ALL_ERROR_CODE_START',
    FETCH_ALL_ERROR_CODE_SUCCESS: 'FETCH_ALL_ERROR_CODE_SUCCESS',
    FETCH_ALL_ERROR_CODE_FAIL: 'FETCH_ALL_ERROR_CODE_FAIL',


    FETCH_ALL_PERSONNEL_START: 'FETCH_ALL_PERSONNEL_START',
    FETCH_ALL_PERSONNEL_SUCCESS: 'FETCH_ALL_PERSONNEL_SUCCESS',
    FETCH_ALL_PERSONNEL_FAIL: 'FETCH_ALL_PERSONNEL_FAIL',

    FETCH_ALL_SELECT_PERSONNEL_START: 'FETCH_ALL_SELECT_PERSONNEL_START',
    FETCH_ALL_SELECT_PERSONNEL_SUCCESS: 'FETCH_ALL_SELECT_PERSONNEL_SUCCESS',
    FETCH_ALL_SELECT_PERSONNEL_FAIL: 'FETCH_ALL_SELECT_PERSONNEL_FAIL',

    FETCH_ALL_SELECT_PERSONNEL_EXTRA_START: 'FETCH_ALL_SELECT_PERSONNEL_EXTRA_START',
    FETCH_ALL_SELECT_PERSONNEL_EXTRA_SUCCESS: 'FETCH_ALL_SELECT_PERSONNEL_EXTRA_SUCCESS',
    FETCH_ALL_SELECT_PERSONNEL_EXTRA_FAIL: 'FETCH_ALL_SELECT_PERSONNEL_EXTRA_FAIL',

    FETCH_ALL_DEPARTMENT_START: 'FETCH_ALL_DEPARTMENT_START',
    FETCH_ALL_DEPARTMENT_SUCCESS: 'FETCH_ALL_DEPARTMENT_SUCCESS',
    FETCH_ALL_DEPARTMENT_FAIL: 'FETCH_ALL_DEPARTMENT_FAIL',


    FETCH_ALL_DAY_PESSONEL_REPORT_START: 'FETCH_ALL_DAY_PESSONEL_REPORT_START',
    FETCH_ALL_DAY_PESSONEL_REPORT_SUCCESS: 'FETCH_ALL_DAY_PESSONEL_REPORT_SUCCESS',
    FETCH_ALL_DAY_PESSONEL_REPORT_FAIL: 'FETCH_ALL_DAY_PESSONEL_REPORT_FAIL',

    FETCH_ALL_MONTH_PESSONEL_REPORT_START: 'FETCH_ALL_MONTH_PESSONEL_REPORT_START',
    FETCH_ALL_MONTH_PESSONEL_REPORT_SUCCESS: 'FETCH_ALL_MONTH_PESSONEL_REPORT_SUCCESS',
    FETCH_ALL_MONTH_PESSONEL_REPORT_FAIL: 'FETCH_ALL_MONTH_PESSONEL_REPORT_FAIL',

    FETCH_ALL_USER_START: 'FETCH_ALL_USER_START',
    FETCH_ALL_USER_SUCCESS: 'FETCH_ALL_USER_SUCCESS',
    FETCH_ALL_USER_FAIL: 'FETCH_ALL_USER_FAIL',
    //admin
    FETCH_ALL_DEVICES_START: 'FETCH_ALL_DEVICES_START',
    FETCH_ALL_DEVICES_SUCCESS: 'FETCH_ALL_DEVICES_SUCCESS',
    FETCH_ALL_DEVICES_FAIL: 'FETCH_ALL_DEVICES_FAIL',


})

export default actionTypes;