import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../redux/actions";
import './OverallReport.scss';
import { VALUE, STATUS_REPORT_HR, STATUS_REPORT_HR_ID, STATUS_USER } from '../../ultil/constant';
import moment from 'moment-timezone';
import { getAllUser } from '../../services/userService'



class OverallReport extends Component {

    state = {
        isDayNight: null,
        dayReport: [],
        nightReport: [],
        reportData: [],
        reportDayOrNight: {},
        allReportInMonth: [],
        reportMonth: [],
        allReportMonthHandle: [],
        allUser: [],
    }

    componentDidMount = async () => {
        this.setState({
            isDayNight: this.props.dayOrNight,
        })
        const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
        const firstDayOfNextMonth = moment().add(1, 'month').startOf('month').format('YYYY-MM-DD');
        await this.props.getAllPerSonnelReportInMonth({ firstDayOfMonth, firstDayOfNextMonth })
        let allUserDb = await getAllUser()
        if (allUserDb && allUserDb.errCode === 0) {
            let dataUser = allUserDb.data
            console.log(dataUser)
            let allUser = dataUser && dataUser.length > 0 ? dataUser.filter(item => item.statusId === STATUS_USER.HOAT_DONG) : []
            this.setState({ allUser })
        }

    };


    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (prevProps.dayOrNight !== this.props.dayOrNight) {
            this.setState({
                isDayNight: this.props.dayOrNight,
            })
        }

        if (prevProps.allReport !== this.props.allReport) {
            let allReport = this.props.allReport;
            if (allReport && allReport.length > 0) {
                let dayReport = await allReport.filter(item => item.dayNight === '1');
                let nightReport = await allReport.filter(item => item.dayNight === '0');
                this.setState({
                    dayReport: dayReport,
                    nightReport: nightReport,
                    isDayNight: this.props.dayOrNight,
                });
            };
        };

        if (prevState.isDayNight !== this.state.isDayNight || prevState.dayReport !== this.state.dayReport || prevState.nightReport !== this.state.nightReport) {
            let listReport = this.state.isDayNight === 'NA'
                ? this.state.dayReport
                : (this.state.isDayNight === 'DE' ? this.state.nightReport : []);
            let reportData = listReport && listReport.length > 0 ? await Promise.all(listReport.map(item => this.results(item) || {})) : [];
            let reportDayOrNight = reportData && reportData.length > 0 ? await reportData.reduce((prev, current) => {
                return {
                    allPersonnel: prev.allPersonnel + current.allUserOfShif,
                    allRepastM: prev.allRepastM + (current?.repastMId?.length || 0) + current.allHv + current.allKh + current.allTv,
                    allRepastE: prev.allRepastE + (current?.repastEId?.length || 0),
                    allOverTime: prev.allOverTime + (current?.workOvertime?.length || 0),
                    allToWork: prev.allToWork + (current?.toWork?.length || 0),
                };
            }, {
                allPersonnel: 0, allToWork: 0, allRepastM: 0, allRepastE: 0, allOverTime: 0
            }) : {};
            this.setState({ reportData, reportDayOrNight });
        };

        if (prevState.allReportInMonth !== this.props.allReportInMonth) {
            this.setState({
                allReportInMonth: this.props.allReportInMonth
            });
        }

        if (prevState.allReportInMonth !== this.state.allReportInMonth) {
            let listReport = this.state.allReportInMonth
            const reportMonth = listReport && listReport.length > 0 ? await Promise.all(listReport.map(item => this.results(item))) : [];
            let allReportMonthHandle = reportMonth && reportMonth.length > 0 ? await reportMonth.reduce((prev, current) => {
                return {
                    allPersonnel: prev.allPersonnel + current.allUserOfShif,
                    allRepastM: prev.allRepastM + (current?.repastMId?.length || 0) + current.allHv + current.allKh + current.allTv,
                    allRepastE: prev.allRepastE + (current?.repastEId?.length || 0),
                    allOverTime: prev.allOverTime + (current?.workOvertime?.length || 0),
                    allToWork: prev.allToWork + (current?.toWork?.length || 0),
                };
            }, {
                allPersonnel: 0, allToWork: 0, allRepastM: 0, allRepastE: 0, allOverTime: 0
            }) : {};
            this.setState({ reportMonth, allReportMonthHandle });
        }



    };

    resultsDayOrNight = async (list) => {

    }

    results = async (list) => {
        let allUserOfShif = list.results.length;
        let report = list.results.reduce((acc, item) => {
            if (item.statusUserId === STATUS_REPORT_HR.DI_LAM || item.statusUserId === STATUS_REPORT_HR.DI_MUON) acc.toWork.push(item);
            //     if (item.statusUserId === STATUS_REPORT_HR.DI_MUON) acc.lateToWork.push(item);
            //     if (item.statusUserId === STATUS_REPORT_HR.NGHI) acc.notGoingToWork.push(item);
            if (item.statusId === STATUS_REPORT_HR_ID.TANG_CA) acc.workOvertime.push(item);
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
        };

        let allKh = reportExtra.KH?.length ? this.sumAll(reportExtra.KH, 'quantity') : 0;
        let allHv = reportExtra.HV?.length ? this.sumAll(reportExtra.HV, 'quantity') : 0;
        let allTv = reportExtra.TV?.length ? this.sumAll(reportExtra.TV, 'quantity') : 0;
        // Lọc lại các danh sách có phép
        report.lateToWorkP = report.lateToWork.filter(item => item.licensed === 1);
        report.notGoingToWorkP = report.notGoingToWork.filter(item => item.licensed === 1);

        return {
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

    handleSelectDayNight = async (dayNight) => {
        await this.props.setDayOrNight(dayNight)
    }


    render() {
        let { isDayNight, reportDayOrNight, allReportMonthHandle, allUser } = this.state
        // Lấy ngày hiện tại
        let today = moment().format('DD-MM');

        // Lấy số ngày từ đầu tháng đến hôm nay
        const daysFromStartOfMonth = moment().diff(moment().startOf('month'), 'days') + 1;
        let percentage = Number((allReportMonthHandle.allPersonnel / (allUser.length * daysFromStartOfMonth) * 100).toFixed(2))
        console.log(percentage)
        return (
            <>
                <div className='overall-report-home-container'>
                    <div className='overall-report-home-to-day'>
                        <div className='overall-report-home-name'>{`${isDayNight === VALUE.NGAY ? 'Báo cáo ngày' : (isDayNight === VALUE.DEM ? 'Bao cáo đêm' : '')}`} <span>{today}</span></div>
                        <div className='item-content'><span>NS chính thức (theo b/c) : </span><span>{`${reportDayOrNight && reportDayOrNight.allToWork && reportDayOrNight.allToWork || 0}/${reportDayOrNight && reportDayOrNight.allPersonnel && reportDayOrNight.allPersonnel || 0}`}</span></div>
                        <div className='item-content'><span>Suất cơm: </span><span>{reportDayOrNight && reportDayOrNight.allRepastM && reportDayOrNight.allRepastM || 0}</span></div>
                        <div className='item-content'><span>Nhân sự tăng ca: </span><span>{reportDayOrNight && reportDayOrNight.allOverTime && reportDayOrNight.allOverTime || 0}</span></div>
                        <div className='item-content'><span>Suất ăn phụ: </span><span>{reportDayOrNight && reportDayOrNight.allRepastE && reportDayOrNight.allRepastE || 0}</span></div>
                    </div>
                    <div className='overall-report-home-month'>
                        <div className='overall-report-home-name'>{`Báo cáo tháng: ${moment().format('MM-YYYY')}`}</div>
                        <div className='item-content'><span>% Nhân sự đi làm: </span><span>{`${percentage}%`}</span></div>
                        <div className='item-content'><span>Suất cơm: </span><span>{allReportMonthHandle && allReportMonthHandle.allRepastM && allReportMonthHandle.allRepastM || 0}</span></div>
                        <div className='item-content'><span>Nhân sự tăng ca: </span><span>{allReportMonthHandle && allReportMonthHandle.allOverTime && allReportMonthHandle.allOverTime || 0}</span></div>
                        <div className='item-content'><span>Suất ăn phụ: </span><span>{allReportMonthHandle && allReportMonthHandle.allRepastE && allReportMonthHandle.allRepastE || 0}</span></div>
                    </div>
                </div>
                <div className='dayOrNight'>
                    <div className={`dayNight day ${this.state.isDayNight === VALUE.NGAY && 'active'}`} onClick={() => this.handleSelectDayNight(VALUE.NGAY)}>Ngày</div>
                    <div className={`dayNight night ${this.state.isDayNight === VALUE.DEM && 'active'}`} onClick={() => this.handleSelectDayNight(VALUE.DEM)} >Đêm</div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        dayOrNight: state.user.dayOrNight,
        allReport: state.user.allReport,
        allReportInMonth: state.user.allReportInMonth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setDayOrNight: (dayOrNight) => dispatch(actions.dayOrNight(dayOrNight)),
        getAllPersonnelReport: (day) => dispatch(actions.getAllPersonnelReportRedux(day)),
        getAllPerSonnelReportInMonth: (dataDay) => dispatch(actions.getAllPersonnelReportInMonthRedux(dataDay)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OverallReport);
