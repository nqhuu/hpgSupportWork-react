import React, { Component } from 'react';
// import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { withRouter } from 'react-router-dom';


class HomeHeader extends Component {



    backHome = () => {
        this.props.history.push('/')
    }

    render() {

        return (
            <>
                <div className='home-header-container'>
                    thanh taskbar
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
