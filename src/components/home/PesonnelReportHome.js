import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../redux/actions";
import './PesonnelReportHome.scss'
import moment from 'moment'
import { getAllPersonnelReport } from '../../services/HrService'
import determineDayAndNight from '../formating/determineDayAndNight'
import { STATUS_REPORT_HR_ID, STATUS_REPORT_HR, STATUS_USER_TYPE_EXTRA } from '../../ultil/constant'
import { current } from '@reduxjs/toolkit';


class PesonnelReportHome extends Component {

    state = {
        dayReport: [],
        nightReport: [],
        allDepartment: [],
        isDayNight: '',
        reportData: [],
    }

    componentDidMount = async () => {
        // let timeNow = moment(); // Lấy giờ, phút, giây
        // // Lấy ngày hiện tại
        // let today = moment().format('YYYY-MM-DD');
        // let tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

        // // Ca ngày: 07:00:00 - 17:00:00 (trong ngày hiện tại)
        // let shiftDayStart = moment(`${today} 07:00:00`);
        // let shiftDayEnd = moment(`${today} 18:59:00`);

        // // Ca đêm: 17:00:00 (hôm nay) - 05:00:00 (ngày mai)
        // let shiftNightStart = moment(`${today} 19:00:00`);
        // let shiftNightEnd = moment(`${tomorrow} 06:59:00`);
        // // timeNow.format('HH:mm:ss'); // Hiển thị thời gian hiện tại dạng chuỗi

        // // console.log(timeNow.isBefore(NA)) // kiểm tra giờ hiện tại có nhỏ hơn NA không (timeNow < NA) ,nếu nhỏ hơn trả về true, lơn hơn trả về false
        // // console.log(timeNow.isAfter(NA)) // kiểm tra giờ hiện tại có lớn hơn NA không (timeNow > NA) ,nếu lớn hơn trả về true, lơn nhỏ trả về false
        // let dayView = '';
        // if (timeNow.isAfter(shiftDayStart) && timeNow.isBefore(shiftDayEnd)) dayView = 'NA';
        // if (timeNow.isAfter(shiftNightStart) && timeNow.isBefore(shiftNightEnd)) dayView = 'DE'
        // let dataDay = {
        //     day: dayView
        // }
        let DayAndNight = determineDayAndNight();

        await this.props.getAllDepartmentRedux()
        let allReport = await getAllPersonnelReport({ day: 'toDay' })
        if (allReport && allReport.errCode === 0) {
            let data = allReport.data
            console.log('data', data)
            let dayReport = await data.filter(item => item.dayNight === '1')
            let nightReport = await data.filter(item => item.dayNight === '0')
            this.setState({
                dayReport: dayReport,
                nightReport: nightReport,
                isDayNight: DayAndNight.day,
            })
        }
    };

    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (prevProps.allDepartment !== this.props.allDepartment) {
            this.setState({
                allDepartment: this.props.allDepartment
            })
        }

        if (prevProps.dayOrNight !== this.props.dayOrNight) {
            this.setState({
                isDayNight: this.props.dayOrNight
            })
        }

        if (prevState.dayReport !== this.state.dayReport || prevState.nightReport !== this.state.nightReport) {
            // let listReport = [];
            let listReport = this.state.isDayNight === 'NA' ? this.state.dayReport : (this.state.isDayNight === 'DE' && this.state.nightReport);
            const reportData = await Promise.all(listReport.map(item => this.results(item)));
            this.setState({ reportData });
        }

    };

    isDepartment = (dpm) => {
        let department = this.state?.allDepartment.find(item => item.departmentId === dpm.department)
        return department?.description
    }

    results = async (list) => {
        console.log(list)
        let department = await this.isDepartment(list);
        let allUserOfShif = list.results.length;
        let report = list.results.reduce((acc, item) => {
            if (item.statusUserId === STATUS_REPORT_HR.DI_LAM || item.statusUserId === STATUS_REPORT_HR.DI_MUON) acc.toWork.push(item);
            if (item.statusUserId === STATUS_REPORT_HR.DI_MUON) acc.lateToWork.push(item);
            if (item.statusUserId === STATUS_REPORT_HR.NGHI) acc.notGoingToWork.push(item);
            if (item.statusId === STATUS_REPORT_HR_ID.TANG_CA) acc.workOvertime.push(item)
            if (item.repastMId === 1) acc.repastMId.push(item);
            if (item.repastEId === 1) acc.repastEId.push(item);

            return acc;
        }, {
            toWork: [], lateToWork: [], notGoingToWork: [], workOvertime: [],
            repastMId: [], repastEId: [], lateToWorkP: [], notGoingToWorkP: []
        });


        let reportExtra = {}
        if (list?.extraData?.length > 0) {
            reportExtra = list.extraData.reduce((acc, item) => {
                if (item.userType) {
                    if (!acc[item.userType]) acc[item.userType] = [];
                    acc[item?.userType].push(item);
                }
                if (item.repastMId === 1) acc.allMeal = +item?.quantity + acc.allMeal

                return acc;
            }, {
                KH: [], HV: [], TV: [], allMeal: 0
            });
        }

        let allKh = reportExtra.KH?.length ? this.sumAll(reportExtra.KH, 'quantity') : 0;
        let allHv = reportExtra.HV?.length ? this.sumAll(reportExtra.HV, 'quantity') : 0;
        let allTv = reportExtra.TV?.length ? this.sumAll(reportExtra.TV, 'quantity') : 0;
        // Lọc lại các danh sách có phép
        report.lateToWorkP = report.lateToWork.filter(item => item.licensed === 1);
        report.notGoingToWorkP = report.notGoingToWork.filter(item => item.licensed === 1);

        return {
            department,
            allUserOfShif,
            ...report,
            reportExtra,
            allKh,
            allHv,
            allTv,
        };
    }

    sumAll = (array, name) => {
        let sum = 0
        if (Array.isArray(array) && array.length > 0) {
            sum = array.reduce((prev, curr) => {
                return prev + (+curr[name])
            }, 0)
        }
        return sum
    }

    render() {
        let { dayReport,
            nightReport,
            allDepartment,
            isDayNight, reportData } = this.state
        console.log('reportData', reportData)
        return (
            <>
                <div className="personnel-home-container">
                    {reportData && reportData.length > 0 &&
                        reportData.map((item, index) => {

                            return (
                                <div className="personnel-home-report-department" key={index}>
                                    <div className="department-name">{item.department}</div>
                                    <div className='department-content-left'>
                                        <div className="report-item">
                                            <span>Đi làm:</span> <span>{`${item.toWork.length}/${item.allUserOfShif}`}</span>
                                        </div>
                                        {item.allKh && item.allKh > 0 ?
                                            <div className="report-item">
                                                <span>Khách hàng</span> <span>{item.allKh}</span>
                                            </div>
                                            : ''
                                        }
                                        {item.allHv && item.allHv > 0 ?
                                            <div className="report-item">
                                                <span>Học việc</span> <span>{item.allHv}</span>
                                            </div>
                                            : ''
                                        }
                                        {item.allTv && item.allTv > 0 ?
                                            <div className="report-item">
                                                <span>Thời vụ</span> <span>{item.allTv}</span>
                                            </div>
                                            : ''
                                        }
                                        <div className="report-item">
                                            <span>Bữa chính:</span> <span>{item.repastMId.length + (item.reportExtra && item.reportExtra.allMeal ? item.reportExtra.allMeal : 0)}</span>
                                        </div>
                                        {
                                            item.workOvertime.length > 0 &&
                                            <div className="report-item">
                                                <span>Tăng ca:</span> <span>{item.workOvertime.length}</span>
                                            </div>
                                        }
                                        {
                                            item.workOvertime.length > 0 && item.repastEId.length > 0 &&
                                            <div className="report-item">
                                                <span>Bữa phụ:</span> <span>{item.repastEId.length}</span>
                                            </div>
                                        }
                                    </div>
                                    <div className='department-content-right'>
                                        {
                                            item.lateToWork.length > 0 &&
                                            <div className="report-item">
                                                <span>Đi muộn:</span> <span>{item.lateToWork.length}</span>
                                            </div>
                                        }
                                        {
                                            item.lateToWork.length > 0 && item.lateToWorkP.length > 0 &&
                                            <div className="report-sub-item">
                                                <span>Có phép:</span> <span>{item.lateToWorkP.length}</span>
                                            </div>
                                        }
                                        {item.lateToWork.length > 0 && (item.lateToWork.length - item.lateToWorkP.length) > 0 &&
                                            <div className="report-sub-item">
                                                <span>Không phép:</span> <span>{item.lateToWork.length - item.lateToWorkP.length}</span>
                                            </div>
                                        }
                                        {
                                            item.notGoingToWork.length > 0 &&
                                            <div className="report-item">
                                                <span>Nghỉ:</span> <span>{item.notGoingToWork.length}</span>
                                            </div>
                                        }
                                        {
                                            item.notGoingToWork.length > 0 && item.notGoingToWorkP.length > 0 &&
                                            <div className="report-sub-item">
                                                <span>Có phép:</span> <span>{item.notGoingToWorkP.length}</span>
                                            </div>
                                        }
                                        {
                                            item.notGoingToWork.length > 0 && (item.notGoingToWork.length - item.notGoingToWorkP.length) > 0 &&
                                            <div className="report-sub-item">
                                                <span>Không phép:</span> <span>{item.notGoingToWork.length - item.notGoingToWorkP.length}</span>
                                            </div>
                                        }

                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        allDepartment: state.user.allDepartment,
        dayOrNight: state.user.dayOrNight
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllDepartmentRedux: () => dispatch(actions.getAllDepartmentRedux()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PesonnelReportHome);
