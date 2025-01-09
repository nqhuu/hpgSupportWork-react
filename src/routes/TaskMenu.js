import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import { history } from '../history';
import { ConnectedRouter as Router } from 'connected-react-router'; // điều hướng trang react-router-dom sẽ tìm các route được đặt trong ConnectedRouter
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import ElectricalSupport from '../components/support/ElectricalSupport';
import ItSupport from '../components/support/ItSupport';
import BookingCar from '../components/booking/BookingCar';
import BookingRoom from '../components/booking/BookingRoom';
import './TaskMenu.scss'



class TaskMenu extends Component {

    state = {

    }



    render() {
        console.log(this.props.isLoggedIn)
        if (!this.props.isLoggedIn) {
            return <Redirect to="/login" />;
        }
        return (
            <>
                <div className='tast-menu-container'>
                    <div className='tast-support-menu'>
                        <Switch>
                            <Route path="/menu-tast/it-support" component={ElectricalSupport} />
                            <Route path="/menu-tast/electrical-support" component={ItSupport} />
                            <Route path="/menu-tast/booking-room" component={BookingRoom} />
                            <Route path="/menu-tast/booking-car" component={BookingCar} />
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
                    <div className='tast-report-hr'>

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

export default connect(mapStateToProps, mapDispatchToProps)(TaskMenu);
