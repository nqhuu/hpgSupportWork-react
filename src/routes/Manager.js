import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { push } from "connected-react-router";
// import { history } from '../history';
// import { ConnectedRouter as Router } from 'connected-react-router'; // điều hướng trang react-router-dom sẽ tìm các route được đặt trong ConnectedRouter
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import ExcelToPDF from '../components/manager/inTem';
import PersonnelManagement from '../components/manager/PersonnelManagement';
import DeviceManagement from '../components/manager/DeviceManagement';



class Manager extends Component {

    state = {

    }



    render() {
        if (!this.props.isLoggedIn) {
            return <Redirect to="/login" />;
        }
        return (
            <>
                <div className='manager-menu-container'>
                    <div className='manager-support-menu'>
                        <Switch>
                            <Route
                                path="/manager/inTem"
                                render={(props) => <ExcelToPDF />}
                            // component={HandleRequest} 
                            />
                            <Route
                                path="/manager/user"
                                render={(props) => <PersonnelManagement />}
                            // component={HandleRequest} 
                            />
                            <Route
                                path="/manager/devices"
                                render={(props) => <DeviceManagement />}
                            // component={HandleRequest} 
                            />

                            <Route component={() => { return (<Redirect to="/" />) }} />

                            {/* React Router không tìm thấy tuyến đường khớp.
                                Tuyến đường <Route component={() => { return (<Redirect to="/login" />) }} /> sẽ được kích hoạt.
                                systemMenuPath trong Redux store có giá trị là /system/user-manage.
                                Thành phần <Redirect> sẽ chuyển hướng người dùng đến /system/user-manage. tránh việc lỗi khi không tìm được route phù hợp*/}
                        </Switch>
                    </div>
                    <div className=''>

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

export default connect(mapStateToProps, mapDispatchToProps)(Manager);
