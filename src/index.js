import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './containers/System/App';
import { PersistGate } from 'redux-persist/integration/react'; // Thêm PersistGate  là component đặc biệt được sử dụng để kết nối persistor với ứng dụng của bạn và đảm bảo rằng Redux state sẽ được phục hồi chính xác trước khi ứng dụng được render.
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
