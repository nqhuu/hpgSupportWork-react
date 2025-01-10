import { combineReducers } from 'redux';
// import appReducer from './appReducer'
import userReducer from './userReducer';
import { history } from '../../history';
import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // sử dụng localStorage
import storageSession from 'redux-persist/lib/storage/session'; // Sử dụng sessionStorage
import { connectRouter } from 'connected-react-router';

// Giả sử bạn có các reducer app và user

// const appPersistConfig = {
//     key: 'app',
//     storage: storageSession
// };

const userPersistConfig = {
    key: 'user',
    storage: storageSession, // Lưu trong sessionStorage
    whitelist: ['isLoggedIn', 'userInfo'], // Chỉ lưu thông tin người dùng,
};

// Kết hợp các reducer
const rootReducer = combineReducers({
    router: connectRouter(history), // Kết hợp router với history

    // Các reducer khác của bạn
    // app: persistReducer(appPersistConfig, appReducer),
    user: persistReducer(userPersistConfig, userReducer),

});

export default rootReducer;
