// import logo from './logo.svg';
import './App.scss';
import { history } from '../../history';
import React, { Component } from 'react';
import { ConnectedRouter as Router } from 'connected-react-router'; // điều hướng trang react-router-dom sẽ tìm các route được đặt trong ConnectedRouter
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from '../Auth/Login';
import HomePage from '../HomePage/HomePage';
import Support from '../../routes/Support';
import HomeBody from '../HomePage/HomeBody';
import ProtectedRoute from './ProtectedRoute';
import HumanResources from '../../routes/HumanResources';
import Manager from '../../routes/Manager'
import '@fortawesome/fontawesome-free/css/all.min.css';
import "react-datepicker/dist/react-datepicker.css";





class App extends Component {


  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {
    return (
      <>
        <Router history={history}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route path="/menu-tast/" render={() => (
              <ProtectedRoute>
                <HomeBody />
              </ProtectedRoute>)
            } />
            <Route path="/support/" render={() => (
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>)
            } />

            <Route path="/hr/" render={() => (
              <ProtectedRoute>
                <HumanResources />
              </ProtectedRoute>)
            } />

            <Route path="/manager/" render={() => (
              <ProtectedRoute>
                <Manager />
              </ProtectedRoute>)
            } />

            <Route path="/" render={() => (
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>)
            } />


          </Switch>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          // transition:Bounce,
          />
        </Router>
      </>
    );
  }

}

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
