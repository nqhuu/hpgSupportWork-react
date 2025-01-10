import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class ProtectedRoute extends Component {
    render() {
        const { isLoggedIn, children } = this.props;

        // Kiểm tra trạng thái đăng nhập
        if (!isLoggedIn) {
            return <Redirect to="/login" />;
        }

        // Nếu đã đăng nhập, render nội dung con
        return children;
    }
}



// Lấy trạng thái từ Redux
const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);