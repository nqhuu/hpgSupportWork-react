import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomePage.scss'
import { push } from "connected-react-router";
import { history } from '../../history';
import { ConnectedRouter as Router } from 'connected-react-router'; // điều hướng trang react-router-dom sẽ tìm các route được đặt trong ConnectedRouter
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import HomeFooter from './HomeFooter';
import HomeHeader from './HomeHeader';
import HomeBody from './HomeBody';


class HomePage extends Component {

    state = {

    }



    render() {
        console.log(this.props.isLoggedIn)
        if (!this.props.isLoggedIn) {
            return <Redirect to="/login" />;
        }
        return (
            <>
                <div className='home-container'>
                    <div className='home-header' >
                        <HomeHeader />
                    </div >
                    <div className='home-body' >
                        <HomeBody />
                    </div>
                    <div className='home-footer' >
                        <HomeFooter />
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
