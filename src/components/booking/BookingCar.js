import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../redux/actions/actionTypes";
import HomeHeader from '../../containers/HomePage/HomeHeader';




class BookingCar extends Component {

    state = {

    }



    render() {
        return (
            <>
                {/* <HomeHeader /> */}
                <div >
                    BookingCar.................
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingCar);
