import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomePage.scss'
import { push } from "connected-react-router";
import { history } from '../../history';
import { ConnectedRouter as Router } from 'connected-react-router'; // điều hướng trang react-router-dom sẽ tìm các route được đặt trong ConnectedRouter
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { handleDataHome } from '../../services/userService'
import * as actions from "../../redux/actions";
import HomeFooter from './HomeFooter';
import HomeHeader from './HomeHeader';
import HomeBody from './HomeBody';


class HomePage extends Component {

    state = {

    }

    componentDidMount = async () => {
        let dataHome = await handleDataHome()
        if (dataHome && dataHome.errCode === 0) {
            let data = dataHome.data
            this.props.handleDataHomeRedux(data)
        }
    }


    render() {
        if (!this.props.isLoggedIn) {
            return <Redirect to="/login" />;
        }
        return (
            <>
                <div className='home-container'>
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
        handleDataHomeRedux: (data) => dispatch(actions.handleDataHomeRedux(data))
        // handleDataHomeRedux: (data) => console.log('handleDataHomeRedux', data)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
