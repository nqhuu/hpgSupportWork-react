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
        listUser: [],
        listTime: [],
        listTimeSelect: {},
        listStatusUserReport: [],
        listStatusUserReportSelect: {},
        isOpenModal: false
    }

    componentDidMount = async () => {
        await this.props.getAllPersonnelRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId);
        // await this.props.getAllPersonnelRedux({ fromDate: '2025-01-8', toDate: '2025-01-8' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId)
        if (!this.props.allPersonnel || this.props.allPersonnel.length === 0) {
            this.getAllUser()
        };

        await this.props.getAllSelectPersonnelRedux();
    }

    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (prevProps.allPersonnel !== this.props.allPersonnel) {
            let allPersonnelRedux = this.props.allPersonnel
            console.log(allPersonnelRedux)
            let allPersonnel = allPersonnelRedux.map((item, index) => {
                item.fullName = `${item.personnelReportData[0].firstName}${item.personnelReportData[0].lastName}`
                return item
            })
            this.setState({
                listUser: allPersonnel
            })
        }

        if (prevProps.allSelectPersonnel !== this.props.allSelectPersonnel) {
            if (this.props.allSelectPersonnel && this.props.allSelectPersonnel.listStatusUserReport) {
                let array = this.props.allSelectPersonnel.listStatusUserReport;
                let listStatusUserReportHandle = array.map(item => {
                    let obj = {};
                    obj.value = item.keyMap;
                    obj.label = item.value;
                    return obj;
                })
                this.setState({
                    listStatusUserReport: listStatusUserReportHandle,
                    listStatusUserReportSelect: listStatusUserReportHandle[0]
                })
            }
            if (this.props.allSelectPersonnel && this.props.allSelectPersonnel.listTime) {
                let array = this.props.allSelectPersonnel.listTime;
                let listTimeHandle = array.map(item => {
                    let obj = {};
                    obj.value = item.keyMap;
                    obj.label = item.value;
                    return obj;
                })
                this.setState({
                    listTime: listTimeHandle,
                })
            }
        }

    }

    getAllUser = async () => {
        let listUser = await getAllUser('', this.props?.userInfo?.departmentId)
        if (listUser && listUser.errCode === 0) {
            this.setStateListUser(listUser.data)
        }
    }

    setStateListUser = async (listUser) => {
        let listUserWorkShifts
        let formattedDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
        let listUserFullDepartment = [];
        if (listUser && listUser.length > 0) {
            listUserFullDepartment = listUser.map((item, index) => {
                let select = {};
                select.userId = item.id;
                select.fullName = `${item.firstName} ${item.lastName}`;
                select.shiftId = item.shiftId;
                select.departmentId = item.departmentId;
                select.reporterId = this.props?.userInfo?.id;
                select.statusUserId = { value: `${STATUS_REPORT_HR.DI_LAM}`, label: 'Đi làm đúng giờ' };; // tình trạng đi làm
                select.licensed = '';
                select.note = '';
                select.delayId = {};
                select.repastMId = 1; // nếu đi làm hoặc đi trế (1 tiếng ?) là 1 nếu không đi làm thì 0 - tức là không ăn
                select.employeeCode = item.employeeCode; // nếu đi làm hoặc đi trế (1 tiếng ?) là 1 nếu không đi làm thì 0 - tức là không ăn
                return select
            })
        }

        if (listUserFullDepartment && listUserFullDepartment.length > 0) {
            listUserWorkShifts = listUserFullDepartment.filter((item, index) => item.shiftId === this.props.userInfo?.shiftId)
        }
        if (listUserWorkShifts) {
            this.setState({
                listUser: listUserWorkShifts
            })
        }
    }


    handleOpenModal = async () => {
        this.setState({
            isOpenModal: true
        })
    }


    handleCloseModal = () => {
        this.setState({
            isOpenModal: false,
        })
    }

    handleChange = async (selectOptions, actionMeta, id,) => {
        let selectCopy = { ...this.state[actionMeta.name] }
        selectCopy.value = selectOptions.value;
        selectCopy.label = selectOptions.label;

        if (selectCopy.value === STATUS_REPORT_HR.DI_LAM || selectCopy.value === STATUS_REPORT_HR.NGHI) {
            this.setState((prevState) => ({
                listUser: prevState.listUser.map((row) =>
                    row.userId === id ? { ...row, [actionMeta.name]: selectCopy, delayId: {} } : row
                ),
            }));
            return;
        }


        this.setState((prevState) => ({
            listUser: prevState.listUser.map((row) =>
                row.userId === id ? { ...row, [actionMeta.name]: selectCopy, } : row //delayId: selectCopy.value !== STATUS_REPORT_HR.DI_MUON && {}
            ),
        }));
    }


    handleSave = async (item) => {

    }

    handleComplete = async (item) => {

    }

    handleChangeInput = async (event, item) => {

        const updatedItem = {
            ...item,
            note: event.target.value, // Thêm hoặc cập nhật thuộc tính giá trị
        };

        //Cập nhật state với callback prevState cập nhật hoặc thêm, xóa 1 item trong mảng kết hợp với các vòng lặp
        this.setState((prevState) => ({
            listUser: prevState.listUser.map((user) =>
                user.userId === updatedItem.userId ? updatedItem : user
            ),
        }));
    }

    handleCheckBox = async (event, item) => {
        const updatedItem = {
            ...item,
            [event.target.name]: event.target.checked === true ? 1 : 0, // Thêm hoặc cập nhật thuộc tính giá trị
        };

        this.setState((prevState) => ({
            listUser: prevState.listUser.map((user) =>
                user.id === updatedItem.id ? updatedItem : user
            ),
        }));
    }

    render() {
        // console.log(this.props.allPersonnel)
        console.log(this.state)
        let { listUser, listTime, listTimeSelect,
            listStatusUserReport } = this.state
        let formattedDate = moment().tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY');
        return (
            <>
                <div className='personel-container'>
                    <div className='personel-header'>
                        <HomeHeader />
                    </div>

                    <div className='personel-body'>
                        <h2>Báo cáo nhận sự</h2>
                        <p>{`Ngày: ${formattedDate}`}</p>
                        <p>{`Bộ phận: ${this.props?.userInfo?.departmentUserData?.departmentName || ''}`}</p>
                        <p>{`Ca/Kip: ${this.props?.userInfo?.shiftId || ''}`}</p>
                        {this.props.allPersonnel && this.props.allPersonnel.length > 0 &&
                            <button type="button" class="btn btn-primary" onClick={() => this.handleOpenModal()}>Báo tăng ca</button>
                        }
                        <div className="mt-3">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Mã</th>
                                        <th>Họ Tên</th>
                                        <th>Tình trạng</th>
                                        <th>Phép</th>
                                        <th>Số giờ đi trễ</th>
                                        <th>Ghi chú</th>
                                        <th>Cơm Chính</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUser && listUser.length > 0 &&
                                        listUser.map((item, index) => {
                                            return (
                                                <>
                                                    <tr key={item.userId}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.employeeCode}</td>
                                                        <td>{item.fullName}</td>
                                                        <td>
                                                            <Select
                                                                value={item.statusUserId}
                                                                options={listStatusUserReport}
                                                                name='statusUserId'
                                                                onChange={(selectOptions, actionMeta) => this.handleChange(selectOptions, actionMeta, item.userId)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="form-check" onClick={(event) => this.handleCheckBox(event, item)}>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={item.userId}
                                                                    name="licensed"
                                                                    value={0}
                                                                    disabled={item.statusUserId.value === STATUS_REPORT_HR.DI_LAM}
                                                                />
                                                                <label className="form-check-label" htmlFor={item.userId}></label>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Select
                                                                value={item.delayId}
                                                                options={listTime}
                                                                name='delayId'
                                                                onChange={(selectOptions, actionMeta) => this.handleChange(selectOptions, actionMeta, item.userId)}
                                                                isDisabled={item.statusUserId.value === STATUS_REPORT_HR.DI_LAM || item.statusUserId.value === STATUS_REPORT_HR.NGHI}
                                                            />
                                                        </td>
                                                        <td>
                                                            {/* <div class="form-group" onChange={(event) => this.handleChangeInput(event, item)} > */}
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                onChange={(event) => this.handleChangeInput(event, item)}
                                                                disabled={item.statusUserId.value === STATUS_REPORT_HR.DI_LAM}
                                                            />
                                                            {/* </div> */}
                                                        </td>
                                                        <td>
                                                            <div className="form-check" onClick={(event) => this.handleCheckBox(event, item)}>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={item.userId}
                                                                    name="repastMId"
                                                                    // value={1}
                                                                    defaultChecked
                                                                />
                                                                <label className="form-check-label" htmlFor={item.userId}></label>
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
                        {!this.props.allPersonnel || this.props.allPersonnel.length === 0 &&
                            <button type="button" class="btn btn-primary" onClick={() => this.handleSendReport()}>Gửi báo cáo</button>
                        }
                    </div>
                    <div className='personel-footer'>
                        <HomeFooter />
                    </div>
                    <ModalPersonel
                        isOpenModal={this.state.isOpenModal}
                        handleCloseModal={this.handleCloseModal}
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
        allSelectPersonnel: state.user.allSelectPersonnel,
        // listTime: state.user.allSelectPersonnel.listTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // handleDataHomeRedux: (data) => dispatch(actions.handleDataHomeRedux(data)),
        getAllPersonnelRedux: (dataDay, shiftsId, departmentId) => dispatch(actions.getAllPersonnelRedux(dataDay, shiftsId, departmentId)),
        getAllSelectPersonnelRedux: () => dispatch(actions.getAllSelectPersonnelRedux())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Personnel));
