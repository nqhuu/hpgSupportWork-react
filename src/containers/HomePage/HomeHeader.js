import React, { Component } from 'react';
import logo from '../../assets/Logo/logo-hpg.png'
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { withRouter } from 'react-router-dom';
import * as actions from "../../redux/actions";




class HomeHeader extends Component {

    state = {
        userInfo: ''
    }

    componentDidMount = () => {
        if (this.props.userInfo && this.props.userInfo.lastName) {
            this.setState({
                userInfo: this.props.userInfo
            })
        }
    }

    handleLogOut = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            this.props.userLogOutSuccess()

        }
    }

    backHome = () => {
        this.props.history.push('/')
    }

    render() {
        let { userInfo } = this.state
        return (
            <>
                <div className='nav-bar-container'>
                    <nav className="nav-bar navbar navbar-expand-sm bg-dark navbar-dark">
                        <div className="container-fluid">
                            <div className='logo-hpg' onClick={() => this.backHome()}>
                                <img src={logo} alt="logo-hpg" width="" height="100%" />
                            </div>
                            <div className='infor-user'>
                                <div className='user-name'>{`Xin chào: ${userInfo.lastName}`}</div>
                                {/* <div className='img-user'>image</div> */}
                                <div className='logout' onClick={() => this.handleLogOut()}>Thoát</div>
                            </div>
                        </div>
                    </nav>
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userLogOutSuccess: () => dispatch(actions.processLogout())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
