import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../redux/actions";
import { Redirect } from 'react-router-dom';
import './Login.scss';
import { handleLoginApi } from '../../services/userService'
import determineDayAndNight from '../../components/formating/determineDayAndNight'


class Login extends Component {

    state = {
        username: '',
        password: '',
        errMessage: ''
    }

    componentDidMount() {
        // Lắng nghe sự kiện keydown toàn cục
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        // Gỡ bỏ sự kiện khi component bị unmount
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleOnChangeInput = (event) => {
        this.setState({
            username: event.target.value,
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value,
        })
    }

    handleLogin = async () => {
        //clear mã lỗi mỗi lần ấn login
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLoginApi(this.state.username, this.state.password)
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }

            if (data && data.errCode === 0) {
                console.log(data.user)
                await this.props.userLoginSuccess(data.user)
                let dayOrNight = await determineDayAndNight()
                await this.props.dayOrNight(dayOrNight.day)
                this.props.history.push('/');
            }

        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errMessage: e.response.data.message
                    })
                }
            }
        }
    }

    handleKeyDown = (event) => {
        if (event.keyCode === 13 || event.key === "Enter") {
            this.handleLogin()
        }
    }

    render() {
        if (this.props.isLoggedIn) {
            return <Redirect to="/" />;
        }
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-login'>Login</div>
                        <div className='col-12 form-group login-input'>
                            <label>Username:</label>
                            <input className='form-control'
                                type='text'
                                placeholder='Enter your Username'
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeInput(event)}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password:</label>
                            <input className='form-control'
                                type='password'
                                placeholder='Enter your Password'
                                onChange={(event) => this.handleOnChangePassword(event)}
                            />
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12'>
                            <button
                                className='btn-login'
                                onClick={() => { this.handleLogin() }}
                                onKeyDown={(event) => this.handleKeyDown(event)}
                            >
                                Login
                            </button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Liên hệ admin để được cung cấp tài khoản</span>
                        </div>
                        <div className='col-12 social-login'>
                        </div>
                    </div>
                </div>
            </div>
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
        // navigate: (path) => dispatch(push(path)),
        userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
        dayOrNight: (dayOrNight) => dispatch(actions.dayOrNight(dayOrNight))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
