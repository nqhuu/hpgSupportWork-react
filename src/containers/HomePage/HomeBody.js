import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { push } from "connected-react-router";
// import { history } from '../../history';
import { Route, Switch, NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import { path, VALUE } from '../../ultil/constant';
import BookingCar from '../../components/booking/BookingCar';
import BookingRoom from '../../components/booking/BookingRoom';
import HomeHeader from './HomeHeader';
import HandleRequest from '../../components/support/HandleRequest';
import PesonnelReportHome from '../../components/home/PesonnelReportHome';
import OverallReport from '../../components/home/OverallReport';
import ColumnChart from '../../components/dashboard/ColumnChart';
import './HomeBody.scss'




class Homebody extends Component {

    state = {

    }

    // moveToReport = () => {
    //     this.props.history.push('/hr/personel-report');
    // }


    render() {
        const { location } = this.props;
        let shouldHideDivs = location.pathname;
        let homeRoute = path.HOME;
        return (
            <>
                <div className='home-header-homepage'>
                    <HomeHeader />
                </div>
                <div className='home-body-container'>
                    <div className='body-left'>
                        <div className='menu-container'>
                            <div className='menu-list'>
                                <div className="dropdown dropend">
                                    <button className="btn  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">

                                        {/* <i className="fas fa-phone-square-alt" style={{ paddingRight: '20px' }}></i> */}
                                        <i className="fas fa-tty" style={{ paddingRight: '20px' }}></i>
                                        Yêu cầu hỗ trợ
                                    </button>

                                    <ul className="dropdown-menu">
                                        <li>
                                            {/* <NavLink className="dropdown-item" exact to="/menu-tast/it-support"> */}
                                            <NavLink className="dropdown-item" exact to="/support/send-request-support-it">
                                                IT support
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/support/send-request-support-elect">
                                                Cơ điện
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                                <div className="dropdown dropend">
                                    <button className="btn  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="fas fa-address-book" style={{ paddingRight: '20px' }}></i>
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
                                <div className="report-hr dropdown dropend">
                                    {/* onClick={() => this.moveToReport()} */}
                                    <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="fas fa-user-check" style={{ paddingRight: '14px' }}></i>
                                        Nhân sự
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/hr/personel-report">
                                                Báo cáo nhân sự
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/hr/personel-report">
                                                Xin nghỉ phép
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/hr/personel-report">
                                                Xin ra ngoài
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/hr/personel-report">
                                                Mang vật tư ra ngoài
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                                <div className='report-all'>
                                    <button type="button" className="btn ">
                                        <i className="fas fa-swatchbook" style={{ paddingRight: '17px' }}></i>
                                        Tổng hợp báo cáo
                                    </button>
                                </div>



                                <div className="dropdown dropend">
                                    <button className="btn  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="fas fa-cogs" style={{ paddingRight: '15px' }}></i>
                                        Manager
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/manager/devices">
                                                Quản lý thiết bị
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/manager/user">
                                                Quản ly nhân viên
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/manager/inTem">
                                                Phân quyền
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" exact to="/manager/inTem">
                                                In Tem Tài Sản
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
                                            <HandleRequest
                                                showHandle={false}
                                                department={VALUE.NOT_YET_COMPLETE_IT}
                                            />
                                        </div>
                                    </div>
                                    <div className='bar-chart bar-chart-support'>
                                        <div className='header'>Biểu đồ</div>
                                        <div className='body'>
                                            <ColumnChart />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className='d-flex  cd-support-container'>
                                    <div className='table-content cd-suport ' >
                                        <div className='header'>Cơ Điện - Home</div>
                                        <div className='body'>
                                            <HandleRequest
                                                showHandle={false}
                                                department={VALUE.NOT_YET_COMPLETE_CD}
                                            />
                                        </div>
                                    </div>
                                    <div className='bar-chart'>
                                        biểu đồ cột kết quả hoàn thành
                                    </div>
                                </div> */}
                                <div className='d-flex  personnel-Reports-container'>
                                    <div className='table-content personnel-Reports ' >
                                        <div className='header'>Báo cáo nhân sự - Home</div>
                                        <div className='body'>
                                            <PesonnelReportHome />
                                        </div>
                                    </div>
                                    <div className='table-content bar-chart'>
                                        <div className='header'>Báo cáo tổng quát</div>
                                        <div className='body'>
                                            <OverallReport />
                                        </div>
                                    </div>
                                </div>
                            </>
                        }

                        <Switch>
                            {/* <Route
                                path="/menu-tast/it-support"
                                render={(props) => <SendRequest {...props} department={VALUE.NOT_YET_COMPLETE_IT} />}
                            // component={SendRequest} 
                            />
                            <Route
                                path="/menu-tast/electrical-support"
                                render={(props) => <SendRequest {...props} department={VALUE.NOT_YET_COMPLETE_CD} />} /> */}

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
