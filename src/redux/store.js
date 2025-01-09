import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { history } from '../history';
import { routerMiddleware } from 'connected-react-router';
import { persistStore } from 'redux-persist';

// Cấu hình store
const store = configureStore({
    reducer: rootReducer, // Kết hợp các reducer (nếu có)
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(routerMiddleware(history)), // Kết nối routerMiddleware
});

const persistor = persistStore(store); // Tạo persistor

export { store, persistor };