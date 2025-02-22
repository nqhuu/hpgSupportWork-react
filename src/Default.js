import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../redux/actions";




class Default extends Component {

    state = {

    }

    componentDidMount = async () => {

    };

    componentDidUpdate = async (prevProps, prevState, snapshot) => {

    };

    render() {
        return (
            <div >

            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Default);
