import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../redux/actions/actionTypes";
import './OverallReport.scss'




class OverallReport extends Component {

    state = {

    }



    render() {
        return (
            <div className='overall-report-home-container'>
                <div className='overall-report-home-to-day'>
                    <div className='overall-report-home-name'>Báo cáo ngày</div>
                    <div className='item-content'><span>Nhân sự đi làm: </span><span>90/95</span></div>
                    <div className='item-content'><span>Suất cơm: </span><span>90</span></div>
                    <div className='item-content'><span>Nhân sự tăng ca: </span><span>15</span></div>
                    <div className='item-content'><span>Suất ăn phụ: </span><span>15</span></div>
                </div>
                <div className='overall-report-home-month'>
                    <div className='overall-report-home-name'>Báo cáo tháng</div>
                    <div className='item-content'><span>% Nhân sự đi làm: </span><span>95%</span></div>
                    <div className='item-content'><span>Suất cơm: </span><span>90</span></div>
                    <div className='item-content'><span>Nhân sự tăng ca: </span><span>15</span></div>
                    <div className='item-content'><span>Suất ăn phụ: </span><span>15</span></div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OverallReport);
