import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import './Personnel.scss'
import * as actions from "../../redux/actions";
import { VALUE, STATUS_REPORT_HR } from '../../ultil/constant';
import { getAllUser, handleCreateUpdatePerSonnelReport } from '../../services/userService'
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
        listStatusUserReport: [],
        isOpenModal: false,
        listExtra: [],
        showHide: false
    }

    componentDidMount = async () => {
        await this.props.getAllSelectPersonnelRedux();
        await this.props.getAllPersonnelRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId);
        // await this.props.getAllPersonnelRedux({ fromDate: '2025-01-8', toDate: '2025-01-8' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId)
        if (!this.props.allPersonnel || this.props.allPersonnel.length === 0) {
            this.getAllUser()
        };

    }

    componentDidUpdate = async (prevProps, prevState, snapshot) => {

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

        if (prevProps.allPersonnel !== this.props.allPersonnel) {
            // console.log(this.state.listStatusUserReport)
            // console.log(this.state.listTime)
            let listStatusUserReport = this.state?.listStatusUserReport;
            let listTime = this.state?.listTime;
            let allPersonnelRedux = this.props.allPersonnel
            let allPersonnel = allPersonnelRedux.map((item, index) => {
                item.fullName = `${item.personnelReportData.firstName} ${item.personnelReportData.lastName}`
                item.employeeCode = item.personnelReportData.employeeCode
                item.statusUserId = listStatusUserReport.filter(status => item.statusUserId === status.value)[0]
                if (item.delayId) item.delayId = listTime.filter(time => item.delayId === +time.label)[0]
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
                select.delayId = '';
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

        if (selectCopy.value === STATUS_REPORT_HR.DI_LAM) {
            this.setState((prevState) => ({
                listUser: prevState.listUser.map((row) =>
                    row.userId === id ? { ...row, [actionMeta.name]: selectCopy, delayId: "", licensed: "" } : row
                ),
            }));
            return;
        }

        if (selectCopy.value === STATUS_REPORT_HR.NGHI) {
            this.setState((prevState) => ({
                listUser: prevState.listUser.map((row) =>
                    row.userId === id ? { ...row, [actionMeta.name]: selectCopy, delayId: "", licensed: 0, repastMId: 0 } : row
                ),
            }));
            return;
        }


        if (selectCopy.value === STATUS_REPORT_HR.DI_MUON) {
            console.log("3", selectCopy, actionMeta.name)

            this.setState((prevState) => ({
                listUser: prevState.listUser.map((row) =>
                    row.userId === id ? { ...row, [actionMeta.name]: selectCopy, licensed: 0 } : row
                ),
            }));
            return;
        }

        this.setState((prevState) => ({
            listUser: prevState.listUser.map((row) =>
                row.userId === id ? { ...row, [actionMeta.name]: selectCopy } : row
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
                user.userId === updatedItem.userId ? updatedItem : user
            ),
        }));
    }

    handleSendReport = async () => {
        let formattedDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
        let response = await handleCreateUpdatePerSonnelReport({
            listUser: this.state.listUser,
            date: formattedDate,
            departmentId: this.props.userInfo.departmentId,
            shiftId: this.props.userInfo.shiftId
        })

        if (response && response.errCode === 0) {
            toast.success(response.errMessage)
            await this.props.getAllPersonnelRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId);

        }

    }

    handleShowHide = async () => {
        this.setState({
            showHide: !this.state.showHide
        })
    }

    handleCancelExtra = async () => {
        if (window.confirm("Bạn có hủy bỏ?")) {
            this.handleShowHide()
            this.setState({
                listExtra: []
            })
        }
    }

    handleAddExtra = async () => {
        alert("add thêm ")
    }
    render() {
        // console.log(this.props.userInfo)
        console.log(this.state)
        let { listUser, listTime, listStatusUserReport } = this.state
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
                            <button style={{ width: "120px" }} type="button" className="btn btn-primary" onClick={() => this.handleOpenModal()}>Báo tăng ca</button>
                        }
                        <div className="mt-3 table-responsive">
                            <table className="table ">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Mã NV</th>
                                        <th>Họ Tên</th>
                                        <th>Tình trạng</th>
                                        <th>Phép</th>
                                        <th>Số giờ đi trễ</th>
                                        <th>Ghi chú</th>
                                        <th>Cơm Chính</th>
                                        {this.props.allPersonnel && this.props.allPersonnel.length > 0 &&
                                            <th>Hành động</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUser && listUser.length > 0 &&
                                        listUser.map((item, index) => {
                                            return (
                                                <>
                                                    <tr key={item.userId}>
                                                        <td style={{ width: "3%", verticalAlign: "middle" }}>{index + 1}</td>
                                                        <td style={{ width: "9%", verticalAlign: "middle" }}>{item.employeeCode}</td>
                                                        <td style={{ width: "10%", verticalAlign: "middle" }}>{item.fullName}</td>
                                                        <td style={{ width: "11%" }}>
                                                            <Select
                                                                value={item.statusUserId}
                                                                options={listStatusUserReport}
                                                                name='statusUserId'
                                                                onChange={(selectOptions, actionMeta) => this.handleChange(selectOptions, actionMeta, item.userId)}
                                                            />
                                                        </td>
                                                        <td style={{ width: "2%" }}>
                                                            <>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={item.userId}
                                                                    name="licensed"
                                                                    checked={item.licensed === 1}
                                                                    // value={0}
                                                                    disabled={item.statusUserId.value === STATUS_REPORT_HR.DI_LAM}
                                                                    onChange={(event) => this.handleCheckBox(event, item)}
                                                                />
                                                                <label className="form-check-label" htmlFor={item.userId}></label>
                                                            </>
                                                        </td>
                                                        <td style={{ width: "7%" }}>
                                                            <Select
                                                                value={item.delayId}
                                                                options={listTime}
                                                                name='delayId'
                                                                onChange={(selectOptions, actionMeta) => this.handleChange(selectOptions, actionMeta, item.userId)}
                                                                isDisabled={item.statusUserId.value === STATUS_REPORT_HR.DI_LAM || item.statusUserId.value === STATUS_REPORT_HR.NGHI}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                onChange={(event) => this.handleChangeInput(event, item)}
                                                                disabled={item.statusUserId.value === STATUS_REPORT_HR.DI_LAM}
                                                            />
                                                        </td>
                                                        <td style={{ width: "6%" }}>
                                                            <>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={item.userId}
                                                                    name="repastMId"
                                                                    disabled={item.statusUserId.value === STATUS_REPORT_HR.NGHI}
                                                                    // value={1}
                                                                    checked={item.repastMId === 1}
                                                                    onChange={(event) => this.handleCheckBox(event, item)}
                                                                />
                                                                <label className="form-check-label" htmlFor={item.userId}></label>
                                                            </>
                                                        </td>
                                                        {this.props.allPersonnel && this.props.allPersonnel.length > 0 &&
                                                            <td style={{ width: "6%" }}>
                                                                <>
                                                                    <div className='' >
                                                                        <i className="fas fa-edit"></i>
                                                                    </div>
                                                                    <div>
                                                                        <i className="fas fa-save"></i>
                                                                    </div>
                                                                    <div className='' >
                                                                        <i className="fas fa-window-close"></i>
                                                                    </div>
                                                                </>
                                                            </td>
                                                        }

                                                    </tr>
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        {this.state.showHide ?
                            <>
                                <div class="table-responsive">
                                    <h4>Báo cáo nhân sự khác</h4>
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Tùy chọn</th>
                                                <th>Số lượng</th>
                                                <th>Ghi chú</th>
                                                <th>Cơm Chính</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr >
                                                <td style={{ width: "3%", verticalAlign: "middle" }}>1</td>
                                                <td style={{ width: "9%" }} >
                                                    <select
                                                        class="form-select"
                                                        aria-label="Default select example"
                                                    >
                                                        <option selected>Tuy chọn...</option>
                                                        <option value="KH">Khách hàng</option>
                                                        <option value="HV">Học việc</option>
                                                        <option value="TV">Thời vụ</option>
                                                    </select>
                                                </td>
                                                <td style={{ width: "10%" }} >
                                                    <input
                                                        type="number"
                                                        className="form-control "
                                                    // onChange={(event) => this.handleChangeInput(event, item)}
                                                    // disabled={item.statusUserId.value === STATUS_REPORT_HR.DI_LAM}
                                                    />
                                                </td>
                                                <td><input
                                                    type="text"
                                                    className="form-control"
                                                // onChange={(event) => this.handleChangeInput(event, item)}
                                                // disabled={item.statusUserId.value === STATUS_REPORT_HR.DI_LAM}
                                                /></td>
                                                <td style={{ width: "6%" }}>
                                                    <>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                        // id={item.userId}
                                                        // name="repastMId"
                                                        // disabled={item.statusUserId.value === STATUS_REPORT_HR.NGHI}
                                                        // value={1}
                                                        // checked={item.repastMId === 1}
                                                        // onChange={(event) => this.handleCheckBox(event, item)}
                                                        />
                                                        {/* <label className="form-check-label" htmlFor={item.userId}></label> */}
                                                    </>
                                                </td>
                                                <td style={{ width: "6%" }}>
                                                    <>
                                                        <div className='' >
                                                            <i className="fas fa-edit"></i>
                                                        </div>
                                                        <div>
                                                            <i className="fas fa-save"></i>
                                                        </div>
                                                        <div className='' >
                                                            <i className="fas fa-window-close"></i>
                                                        </div>

                                                        <div className='' >
                                                            <i className="far fa-trash-alt"></i>
                                                        </div>
                                                    </>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div >
                                    <button style={{ width: "55px" }} type="button" className="btn btn-success" onClick={() => this.handleAddExtra()} >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                    <button style={{ width: "55px", margin: "0 10px" }} type="button" className="btn btn-danger" onClick={() => this.handleCancelExtra()}>
                                        <i className="fas fa-times fa-lg"></i>
                                    </button>
                                    {!this.props.allPersonnel || this.props.allPersonnel.length === 0 ?
                                        <button style={{ width: "120px" }} type="button" className="btn btn-warning" onClick={() => this.handleSendReport()}>Gửi báo cáo</button>
                                        :
                                        <button style={{ width: "120px" }} type="button" className="btn btn-warning" >Cập nhật</button>
                                    }
                                </div>
                            </>
                            :
                            <div>
                                <button style={{ padding: "0" }} type="button" className="btn" onClick={() => this.handleShowHide()}>
                                    <i className="fas fa-user-plus"></i>
                                </button>
                            </div>
                        }

                        {!this.props.allPersonnel || this.props.allPersonnel.length === 0 && !this.state.showHide &&
                            <button style={{ width: "120px", marginTop: "10px" }} type="button" className="btn btn-warning" onClick={() => this.handleSendReport()}>Gửi báo cáo</button>
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
