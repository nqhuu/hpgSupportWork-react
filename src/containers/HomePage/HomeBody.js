import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import { history } from '../../history';
import { ConnectedRouter as Router } from 'connected-react-router'; // điều hướng trang react-router-dom sẽ tìm các route được đặt trong ConnectedRouter
import { Route, Switch, NavLink } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import './HomeBody.scss'




class Homebody extends Component {

    state = {

    }



    render() {
        console.log(this.props.isLoggedIn)
        return (
            <>
                <div className='home-body-container'>
                    <div className='body-left'>
                        <div className='menu-container'>
                            <div className='menu-name'>
                                HPGlass
                            </div>
                            <div className='menu-list'>
                                <div className="dropdown dropend">
                                    <button className="btn  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Yêu cầu hỗ trợ
                                    </button>

                                    <ul className="dropdown-menu">
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/menu-tast/it-support">
                                                IT support
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/menu-tast/electrical-support">
                                                Cơ điện
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                                <div className="dropdown dropend">
                                    <button className="btn  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Booking
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/menu-tast/booking-room">
                                                Đặt phòng họp
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/menu-tast/booking-car">
                                                Đặt xe
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                                <div className='report-hr'>
                                    <button type="button" className="btn ">  Báo cáo nhân sự</button>
                                </div>
                                <div className='report-all'>
                                    <button type="button" className="btn "> Tổng hợp báo cáo</button>
                                </div>


                            </div>
                        </div>
                    </div>
                    <div className='body-right'>

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

export default connect(mapStateToProps, mapDispatchToProps)(Homebody);
