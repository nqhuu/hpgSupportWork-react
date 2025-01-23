import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import './Personnel.scss'
import * as actions from "../../redux/actions";
import { VALUE, STATUS_REPORT_HR } from '../../ultil/constant';
import { getAllUser, updateRequestSupport } from '../../services/userService'
import HomeHeader from '../../containers/HomePage/HomeHeader';
import HomeFooter from '../../containers/HomePage/HomeFooter'
import Select from 'react-select';
import _ from 'lodash'
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
// import moment from 'moment'
import moment from 'moment-timezone';
import ModalPersonel from '../modal/ModalPersonel';





class Personnel extends Component {
    state = {
        listUser: {},
    }

    componentDidMount = async () => {
        // await this.props.getAllPersonnelRedux({ day: 'toDay' },this.props.userInfo.shiftsId, this.props.userInfo.departmentId)
        await this.props.getAllPersonnelRedux({ fromDate: '2025-01-8', toDate: '2025-01-8' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId)
        if (!this.props.allPersonnel || this.props.allPersonnel.length === 0) {
            this.getAllUser()
        }
    }

    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (prevProps.allPersonnel !== this.props.allPersonnel) {
            let allPersonnelRedux = this.props.allPersonnel
            let allPersonnel = allPersonnelRedux.map((item, index) => {
                item.fullName = `${item.personnelReportData[0].firstName}${item.personnelReportData[0].lastName}`
                return item
            })
            this.setState({
                listUser: allPersonnel
            })
        }
    }

    getAllUser = async () => {
        let listUser = await getAllUser('', this.props?.userInfo?.departmentId)
        if (listUser && listUser.errCode === 0) {
            this.setStateListUser(listUser)
        }

    }

    setStateListUser = async (listUser) => {
        let listUserWorkShifts
        let formattedDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
        let listUserFullDepartment = listUser.data.map((item, index) => {
            let select = {};
            select.id = item.id;
            select.fullName = `${item.firstName} ${item.lastName}`;
            select.shiftId = item.shiftId;
            select.departmentId = item.departmentId;
            select.reporterId = this.props?.userInfo?.id;
            select.statusUserId = STATUS_REPORT_HR.DI_LAM; // tình trạng đi làm
            select.note = '';
            select.delayId = '';
            select.repastMId = 1; // nếu đi làm hoặc đi trế (1 tiếng ?) là 1 nếu không đi làm thì 0 - tức là không ăn
            return select
        })
        if (listUserFullDepartment) {
            listUserWorkShifts = listUserFullDepartment.filter((item, index) => item.shiftId === this.props.userInfo?.shiftId)
        }
        if (listUserWorkShifts) {
            this.setState({
                listUser: listUserWorkShifts
            })
        }
    }



    // Xử lý khi sang trang
    handlePageClick = async (event) => {
        const newOffset = (event.selected);
        this.setState({
            currentPage: newOffset
        }, () => this.getRequestSupport(this.state.isDeparment, this.state.currentPage, this.state.limit))
    };

    handleProcessing = async (item, id) => {


    }

    closeHandleProcessing = async (item, id) => {
        this.setState({
            selectRequestId: '',
        })
    }

    handleChange = async (selectedOption) => {
        this.setState({
            selectedOption: selectedOption
        })
    }


    handleSave = async (item) => {
        let { description, selectedOption } = this.state
        let data = {
            requestId: item.id,
            repairer: selectedOption,
            description: description,
            handleEditRequest: VALUE.HANDLE_REQUEST
        }

        if (data) {
            let response = await updateRequestSupport(data)
            if (response && response.errCode === 0) {
                toast.success(response.errMessage)
                this.getRequestSupport()
                this.closeHandleProcessing()
            }
        }

    }

    handleComplete = async (item) => {

    }

    handleChangeInput = async (event, id) => {
        this.setState({
            [id]: event.target.value
        })
    }

    handleComplete = async (item) => {
        if (window.confirm("Xác nhận đã xử lý xong")) {

        }
    }

    handleCheckBox = async (event) => {
        console.log(event.target)
        console.log(event.target.checked)
    }

    render() {
        console.log(this.props.userInfo)
        // console.log(this.state)
        let { listUser } = this.state

        return (
            <>
                <div className='personel-container'>
                    <div className='personel-header'>
                        <HomeHeader />
                    </div>

                    <div className='personel-body'>
                        <h2>Báo cáo nhận sự</h2>
                        <p>Bộ phận</p>
                        <p>Ca/Kip</p>
                        <div className="mt-3">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Họ Tên</th>
                                        <th>Tình trạng</th>
                                        <th>Số giờ đi trễ</th>
                                        <th>Cơm Chính</th>
                                        <th>Tăng ca</th>
                                        <th>Số giờ tăng ca</th>
                                        <th>Bữa Phụ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUser && listUser.length > 0 &&
                                        listUser.map((item, index) => {
                                            return (
                                                <>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.fullName}</td>
                                                        <td><Select /></td>
                                                        <td><Select /></td>
                                                        <td>
                                                            <div className="form-check" onClick={(event) => this.handleCheckBox(event)}>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={item.id}
                                                                    name="repastMId"
                                                                    value={1}
                                                                    defaultChecked
                                                                />
                                                                <label className="form-check-label" htmlFor={item.id}></label>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check" onClick={(event) => this.handleCheckBox(event)} >
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={item.id}
                                                                    name="overTime"
                                                                    value={1}
                                                                />
                                                                <label className="form-check-label" htmlFor={item.id}></label>
                                                            </div>
                                                        </td>
                                                        <td><Select /></td>
                                                        <td>
                                                            <div className="form-check" onClick={(event) => this.handleCheckBox(event)}>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={item.id}
                                                                    name="repastMId"
                                                                    value={1}
                                                                />
                                                                <label className="form-check-label" htmlFor={item.id}></label>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='personel-footer'>
                        <HomeFooter />
                    </div>
                    <ModalPersonel
                    // isOpenModal={true}
                    />
                </div>

            </>
        )
    }
}

const mapStateToProps = state => {

    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        allPersonnel: state.user.allPersonnel,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // handleDataHomeRedux: (data) => dispatch(actions.handleDataHomeRedux(data)),
        getAllPersonnelRedux: (dataDay) => dispatch(actions.getAllPersonnelRedux(dataDay))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Personnel));
