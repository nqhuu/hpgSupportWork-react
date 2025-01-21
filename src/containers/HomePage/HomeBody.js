import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { push } from "connected-react-router";
// import { history } from '../../history';
import { Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import { path, CODE, VALUE } from '../../ultil/constant';
import ElectricalSupport from '../../components/support/ElectricalSupport';
import ItSupport from '../../components/support/ItSupport';
import BookingCar from '../../components/booking/BookingCar';
import BookingRoom from '../../components/booking/BookingRoom';
import HomeHeader from './HomeHeader';
import ItSupportHome from '../../components/home/ItSupportHome';
import ItHandleSupport from '../../components/support/ItHandleSupport'
import ElectricalSupportHome from '../../components/home/ElectricalSupportHome';
// import HomePage from '../HomePage/HomePage';
import './HomeBody.scss'




class Homebody extends Component {

    state = {

    }



    render() {
        const { location } = this.props;
        let shouldHideDivs = location.pathname;
        let homeRoute = path.HOME;
        return (
            <>
                <HomeHeader />
                <div className='home-body-container'>
                    <div className='body-left'>
                        <div className='menu-container'>
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
                                    <button type="button" className="btn ">Báo cáo nhân sự</button>
                                </div>
                                <div className='report-all'>
                                    <button type="button" className="btn ">Tổng hợp báo cáo</button>
                                </div>



                                <div className="dropdown dropend">
                                    <button className="btn  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Manager
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/menu-tast/booking-room">
                                                Quản lý thiết bị
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/menu-tast/booking-car">
                                                Quản ly nhân viên
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/menu-tast/booking-car">
                                                Phân quyền
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='body-right'>
                        {shouldHideDivs === homeRoute &&
                            <>
                                <div className='d-flex  it-support-container'>
                                    <div className='table-content it-suport' >
                                        <div className='header'>{`IT Support - ${new Date().getDate()}/${String(new Date().getMonth() + 1).padStart(2, '0')}`}</div>
                                        <div className='body'>
                                            {/* <ItSupportHome /> */}
                                            <ItHandleSupport
                                                showHandle={false}
                                                department={VALUE.NOT_YET_COMPLETE_IT}
                                            />
                                        </div>
                                    </div>
                                    <div className='bar-chart'>
                                        biểu đồ cột kết quả hoàn thành
                                    </div>
                                </div>
                                <div className='d-flex  cd-support-container'>
                                    <div className='table-content cd-suport ' >
                                        <div className='header'>Cơ Điện - Home</div>
                                        <div className='body'>
                                            <ItHandleSupport
                                                showHandle={false}
                                                department={VALUE.NOT_YET_COMPLETE_CD}
                                            />
                                        </div>
                                    </div>
                                    <div className='bar-chart'>
                                        biểu đồ cột kết quả hoàn thành
                                    </div>
                                </div>
                                <div className='d-flex  personnel-Reports-container'>
                                    <div className='table-content personnel-Reports ' >
                                        <div className='header'>Báo cáo nhân sự - Home</div>
                                        <ElectricalSupportHome />
                                    </div>
                                    <div className='bar-chart'>
                                        bảng phụ gì đó
                                    </div>
                                </div>
                            </>
                        }

                        <Switch>
                            <Route path="/menu-tast/it-support" component={ItSupport} />
                            <Route path="/menu-tast/electrical-support" component={ElectricalSupport} />
                            <Route path="/menu-tast/booking-room" component={BookingRoom} />
                            <Route path="/menu-tast/booking-car" component={BookingCar} />


                            {/* <Route path="*" component={HomePage} /> */}
                            {/* <Route path="/booking-room" component={ } />
                                                    /* <Route path="/booking-car" component={ } />
                                                    <Route path="/report-hr" component={ } />
                                                    <Route path="/report" component={ } /> */}
                            {/* <Route component={() => { return (<Redirect to={systemMenuPath} />) }} /> */}
                            {/* React Router không tìm thấy tuyến đường khớp.
                                                        Tuyến đường <Route component={() => { return (<Redirect to={systemMenuPath} />) }} /> sẽ được kích hoạt.
                                                        systemMenuPath trong Redux store có giá trị là /system/user-manage.
                                                        Thành phần <Redirect> sẽ chuyển hướng người dùng đến /system/user-manage. tránh việc lỗi khi không tìm được route phù hợp*/}
                        </Switch>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Homebody));
