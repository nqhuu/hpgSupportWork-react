import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import { history } from '../history';
import { ConnectedRouter as Router } from 'connected-react-router'; // điều hướng trang react-router-dom sẽ tìm các route được đặt trong ConnectedRouter
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import './Support.scss'
import HandleRequest from '../components/support/HandleRequest';
import { VALUE } from '../ultil/constant'



class Support extends Component {

    state = {

    }



    render() {
        if (!this.props.isLoggedIn) {
            return <Redirect to="/login" />;
        }
        return (
            <>
                <div className='tast-menu-container'>
                    <div className='tast-support-menu'>
                        <Switch>
                            <Route
                                path="/support/it-handle"
                                render={(props) => <HandleRequest {...props} key="it-support" department={VALUE.NOT_YET_COMPLETE_IT} />}
                            // component={HandleRequest} 
                            />
                            <Route
                                path="/support/elect-handle"
                                render={(props) => <HandleRequest {...props} key="electrical-support" department={VALUE.NOT_YET_COMPLETE_CD} />}
                            />
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

export default connect(mapStateToProps, mapDispatchToProps)(Support);
