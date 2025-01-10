import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeFooter.scss'


class HomeFooter extends Component {

    render() {

        return (
            <div className='home-footer' >
                <div className='company-name'> &copy; Kính hồng Phúc <a target='_blank' href='https://kinhhongphuc.vn/'>More information</a></div>
            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
