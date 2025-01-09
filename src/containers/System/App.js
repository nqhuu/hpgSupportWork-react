// import logo from './logo.svg';
import './App.scss';
import { history } from '../../history';
import React, { Component } from 'react';
import { ConnectedRouter as Router } from 'connected-react-router'; // điều hướng trang react-router-dom sẽ tìm các route được đặt trong ConnectedRouter
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../Auth/Login';
import HomePage from '../HomePage/HomePage';
import TaskMenu from '../../routes/TaskMenu';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';




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
            <Route path="/menu-tast/" component={TaskMenu} />
            <Route path="/" component={HomePage} />
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
