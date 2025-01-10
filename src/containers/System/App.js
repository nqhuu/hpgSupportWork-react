// import logo from './logo.svg';
import './App.scss';
import { history } from '../../history';
import React, { Component } from 'react';
import { ConnectedRouter as Router } from 'connected-react-router'; // điều hướng trang react-router-dom sẽ tìm các route được đặt trong ConnectedRouter
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from '../Auth/Login';
import HomePage from '../HomePage/HomePage';
import TaskMenu from '../../routes/TaskMenu';
import HomeBody from '../HomePage/HomeBody';
import ProtectedRoute from './ProtectedRoute'




class App extends Component {


  componentDidMount() {

  }

  componentDidUpdate() {

  }
  /* <Route path="/manage-device" component={} />
              <Route path="/menu-tast" component={} />
              */

  render() {
    return (
      <>
        <Router history={history}>
          <Switch>
            <Route exact path="/login" component={Login} />
            {/* <Route path="/menu-tast/" component={TaskMenu} /> */}
            <Route path="/menu-tast/" render={() => (
              <ProtectedRoute>
                <HomeBody />
              </ProtectedRoute>)
            } />
            <Route path="/" render={() => (
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>)
            } />
          </Switch>
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
