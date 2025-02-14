import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Personnel.scss'
import * as actions from "../../redux/actions";
import { STATUS_REPORT_HR } from '../../ultil/constant';
import { getAllUser, handleCreateUpdatePerSonnelReport, handleDeletePersonnelExtra } from '../../services/userService'
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
        showHide: false,
        idDisable: '',
        idDisableExtra: '',
        listUserBeforEdit: [],
        listUserBeforEditExtra: [],
        userUpdate: [],
        extraUpdate: {},
        resetModal: false
    };

    componentDidMount = async () => {
        await this.props.getAllSelectPersonnelRedux();
        await this.props.getAllPersonnelExtraRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId)
        await this.props.getAllPersonnelRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId);
        // await this.props.getAllPersonnelRedux({ fromDate: '2025-01-8', toDate: '2025-01-8' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId)
        if (!this.props.allPersonnel || this.props.allPersonnel.length === 0) {
            this.getAllUser()
        };

    };

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
            };
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
            };
        };

        if (prevProps.allPersonnel !== this.props.allPersonnel) {
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
        };

        if (prevProps.allPersonnelExtra !== this.props.allPersonnelExtra) {
            let allPersonnelExtraRedux = [...this.props.allPersonnelExtra]
            let allPersonnelExtra = allPersonnelExtraRedux.map((item, index) => {
                let newItem = { ...item }
                delete newItem.createdAt;
                delete newItem.personnelExtraReportData;
                delete newItem.updatedAt;
                return newItem
            })
            this.setState({
                listExtra: allPersonnelExtra,
                showHide: this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 && true
            })
        }
    };

    getAllUser = async () => {
        let listUser = await getAllUser('', this.props?.userInfo?.departmentId)
        if (listUser && listUser.errCode === 0) {
            this.setStateListUser(listUser.data)
        }
    };

    setStateListUser = async (listUser) => {
        let listUserWorkShifts
        // let formattedDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
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
                select.licensed = null;
                select.note = null;
                select.delayId = null;
                select.overtimeId = null;
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
    };

    handleOpenModal = async () => {
        this.setState({
            isOpenModal: true
        })
    };

    handleCloseModal = () => {
        this.setState({
            isOpenModal: false,
        })
    };

    handleChangeSelect = async (selectOptions, actionMeta, id,) => {


        let selectCopy = { ...this.state[actionMeta.name] }
        selectCopy.value = selectOptions.value;
        selectCopy.label = selectOptions.label;

        if (selectCopy.value === STATUS_REPORT_HR.DI_LAM) {
            if (this.props.allPersonnel && this.props.allPersonnel.length > 0) {
                this.setState((prevState) => ({
                    userUpdate: [{ ...this.state.userUpdate[0], [actionMeta.name]: selectCopy, note: null, delayId: null, licensed: null, repastMId: 1 }]
                }));
                return;
            }
            this.setState((prevState) => ({
                listUser: prevState.listUser.map((row) =>
                    row.userId === id ? { ...row, [actionMeta.name]: selectCopy, note: null, delayId: null, licensed: null, repastMId: 1 } : row
                ),
            }));
            return;
        }

        if (selectCopy.value === STATUS_REPORT_HR.NGHI) {
            if (this.props.allPersonnel && this.props.allPersonnel.length > 0) {
                this.setState((prevState) => ({
                    userUpdate: [{ ...this.state.userUpdate[0], [actionMeta.name]: selectCopy, delayId: null, licensed: 0, repastMId: 0 }]
                }));
                return;
            }

            this.setState((prevState) => ({
                listUser: prevState.listUser.map((row) =>
                    row.userId === id ? { ...row, [actionMeta.name]: selectCopy, delayId: null, licensed: 0, repastMId: 0 } : row
                ),
            }));
            return;
        }

        if (selectCopy.value === STATUS_REPORT_HR.DI_MUON) {
            if (this.props.allPersonnel && this.props.allPersonnel.length > 0) {
                this.setState((prevState) => ({
                    userUpdate: [{ ...this.state.userUpdate[0], [actionMeta.name]: selectCopy, licensed: 0, repastMId: 1 }]
                }));

                return;
            }
            this.setState((prevState) => ({
                listUser: prevState.listUser.map((row) =>
                    row.userId === id ? { ...row, [actionMeta.name]: selectCopy, licensed: 0, repastMId: 1 } : row
                ),
            }));
            return;
        }

        if (this.props.allPersonnel && this.props.allPersonnel.length > 0) {
            this.setState((prevState) => ({
                userUpdate: [{ ...this.state.userUpdate[0], [actionMeta.name]: selectCopy }]
            }));
            return;
        }

        this.setState((prevState) => ({
            listUser: prevState.listUser.map((row) =>
                row.userId === id ? { ...row, [actionMeta.name]: selectCopy } : row
            ),
        }));


    };

    handleSave = async (item, id) => {
        if (id === 'saveEditPesonel') {
            let response = await handleCreateUpdatePerSonnelReport({
                userUpdate: this.state.userUpdate
            })

            console.log('response', response)
            if (response.length > 0) {
                if (response[0] === 0) toast.success("Cập nhật báo cáo thành công");
                if (response[0] === 1) toast.warning("Cập nhật không thành công");

                await this.props.getAllPersonnelRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId);
                this.setState({
                    idDisable: "",
                    userUpdate: [],
                })
            }
        }
        if (id === 'saveEditExtra') {
            let response = await handleCreateUpdatePerSonnelReport({
                id: item.id,
                extraUpdate: this.state.extraUpdate
            })
            console.log(response)
            if (response && response.errCode === 0) {
                toast.success(response.errMessage)
                await this.props.getAllPersonnelExtraRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId)
                this.setState({
                    idDisableExtra: '',
                    extraUpdate: {},
                })
            }
        }

        if (id === 'overtimeReport') { //dữ liệu gửi về bên modal
            let response = await handleCreateUpdatePerSonnelReport({
                userUpdate: item
            })
            console.log(response)
            if (response && response.length > 0) {
                let checkUpdate = await response.some(item => item === 0)
                console.log(checkUpdate)
                checkUpdate ? toast.success("Cập nhật báo cáo tăng ca thành công") : toast.warning("Không có cập nhật nào");
                await this.props.getAllPersonnelRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId);
                this.setState({
                    isOpenModal: false,
                    resetModal: true,
                })
            }
        }
    };

    handleChangeInput = async (event, item) => {

        const updatedItem = {
            ...item,
            note: event.target.value, // Thêm hoặc cập nhật thuộc tính giá trị
        };

        //Cập nhật state với callback prevState cập nhật hoặc thêm, xóa 1 item trong mảng kết hợp với các vòng lặp
        if (this.props.allPersonnel && this.props.allPersonnel.length > 0) {
            this.setState((prevState) => ({
                userUpdate: [{ ...updatedItem }]
            }));
        } else {
            this.setState((prevState) => ({
                listUser: prevState.listUser.map((user) =>
                    user.userId === updatedItem.userId ? updatedItem : user
                ),
            }));
        }


    };

    handleCheckBox = async (event, item) => {
        let updatedItem = {
            ...item,
            [event.target.name]: event.target.checked === true ? 1 : 0, // Thêm hoặc cập nhật thuộc tính giá trị
        };
        if (this.props.allPersonnel && this.props.allPersonnel.length > 0) {
            this.setState((prevState) => ({
                userUpdate: [{ ...updatedItem }]
            }));
        } else {
            this.setState((prevState) => ({
                listUser: prevState.listUser.map((user) =>
                    user.userId === updatedItem.userId ? updatedItem : user
                ),
            }));
        }

    };

    handleSendReport = async () => {
        let formattedDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
        if (!_.isEmpty(this.state.listExtra)) {
            let check = await this.validateExtra();
            if (check) {
                toast.error('Bạn cần nhập đủ các trường "Tùy chọn" và "Số lượng", nhấn X để hủy bỏ')
                return;
            }
        }

        let response = await handleCreateUpdatePerSonnelReport({
            listUser: this.state.listUser,
            listExtra: this.state.listExtra,
            date: formattedDate,
            departmentId: this.props.userInfo.departmentId,
            shiftId: this.props.userInfo.shiftId
        })

        if (response && response.errCode === 0) {
            toast.success(response.errMessage)
            await this.props.getAllPersonnelRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId);
            await this.props.getAllPersonnelExtraRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId)
        }

        if (response && response.errCode === 1) {
            toast.success(response.errMessage)
            await this.props.getAllPersonnelExtraRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId)
        }

    };

    handleShowHide = async () => {
        this.setState({
            showHide: true,
            listExtra: this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 ? this.props.allPersonnelExtra
                :
                [
                    {
                        id: Date.now(),
                        reporterId: this.props.userInfo.id,
                        quantity: '',
                        departmentId: this.props.userInfo.departmentId,
                        shiftId: this.props.userInfo.shiftId,
                        userType: '',
                        overtimeId: null,
                        repastMId: 1,
                        repastEId: null,
                        note: null,
                        statusId: null
                    }
                ],
        })
    };

    handleCancelExtra = async () => {
        if (window.confirm("Bạn có hủy bỏ tất cả bản ghi vừa tạo?")) {
            this.setState({
                listExtra: this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 ? [...this.props.allPersonnelExtra] : [],
                showHide: this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 ? true : false
            });
            toast.success('Hủy bỏ thành công')
        }
    };

    handleCheckBoxExtra = async (event, item) => {
        const updatedItem = {
            ...item,
            [event.target.name]: event.target.checked === true ? 1 : 0, // Thêm hoặc cập nhật thuộc tính giá trị
        };
        this.setState((prevState) => ({
            listExtra: prevState.listExtra.map((user, indexList) =>
                user.id === item.id ? updatedItem : user
            ),
        }));
    };

    handleSelectExtra = async (event, item) => {
        const updatedItem = {
            ...item,
            userType: event.target.value, // Thêm hoặc cập nhật thuộc tính giá trị
        };
        //Cập nhật state với callback prevState cập nhật hoặc thêm, xóa 1 item trong mảng kết hợp với các vòng lặp

        if (this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 && item.id === this.state.extraUpdate.id) {
            this.setState({
                extraUpdate: updatedItem
            });
        } else {
            this.setState((prevState) => ({
                listExtra: prevState.listExtra.map((user) =>
                    user.id === item.id ? updatedItem : user
                ),
            }));
        }
    }

    handleChangeInputExtra = async (event, item, id) => {

        if (id === 'quantity') {
            let quantity = +event.target.value;
            if (quantity < 1 || !Number.isInteger(quantity)) {
                alert("Vui lòng nhập số hợp lệ!");
                return;
            }
        }

        const updatedItem = {
            ...item,
            [id]: event.target.value, // Thêm hoặc cập nhật thuộc tính giá trị
        };

        //Cập nhật state với callback prevState cập nhật hoặc thêm, xóa 1 item trong mảng kết hợp với các vòng lặp
        if (this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 && item.id === this.state.extraUpdate.id) {
            this.setState((prevState) => ({
                extraUpdate: updatedItem
            }));
        } else {
            this.setState((prevState) => ({
                listExtra: prevState.listExtra.map((user) =>
                    user.id === item.id ? updatedItem : user
                ),
            }));
        };
    };

    HandleDeleteExtra = async (event, item, index) => {
        let listExtraCopy = [...this.state.listExtra]
        if (listExtraCopy.length > 0) {
            if (window.confirm("Bạn có thực sự muốn xóa bản ghi này?")) {
                let checkProps = false;
                if (this.props.allPersonnelExtra) {
                    checkProps = this.props.allPersonnelExtra.some(extra => extra.id === item.id) // check tồn tại trong redux
                }

                if (checkProps) {
                    let response = await handleDeletePersonnelExtra(item.id)
                    console.log(response)
                    if (response && response.errCode === 0) {
                        await this.props.getAllPersonnelExtraRedux({ day: 'toDay' }, this.props.userInfo.shiftsId, this.props.userInfo.departmentId)
                        toast.success('Xóa thành công')
                        return;
                    }
                } else {
                    if (listExtraCopy.length === 1) {
                        let check = await this.validateExtra();
                        if (!check) {
                            this.setState({
                                listExtra: [{
                                    id: Date.now(),
                                    reporterId: this.props.userInfo.id,
                                    quantity: '',
                                    departmentId: this.props.userInfo.departmentId,
                                    shiftId: this.props.userInfo.shiftId,
                                    userType: '',
                                    overtimeId: null,
                                    repastMId: 1,
                                    repastEId: null,
                                    note: null,
                                    statusId: null,
                                }]
                            }, () => toast.success('Xóa thành công'))
                        } else {
                            toast.error('Chưa có bản ghi nào, Click X đỏ để hủy bỏ ')
                        }
                        return;
                    }
                    listExtraCopy.splice(index, 1)
                    this.setState({
                        listExtra: [...listExtraCopy]
                    }, () => toast.success('Xóa thành công'))
                }
            }
        }
    }

    UpdateAddNewExtra = () => {
        if (this.state.listExtra.length > this.props.allPersonnelExtra.length) {
            this.handleSendReport()
        }
    }

    validateExtra = async () => {
        let listExtra = [...this.state.listExtra]
        let listExtraCopy = [listExtra[listExtra.length - 1].userType, listExtra[listExtra.length - 1].quantity];
        let validate = false;
        validate = await listExtraCopy.some(item => item === null ||
            item === undefined ||
            item === '' ||
            (Array.isArray(item) && item.length === 0) ||
            (typeof item === 'object' && Object.keys(item).length === 0) ||
            (typeof item === 'number' && !item))
        return validate
    }

    handleAddExtra = async () => {
        let check = await this.validateExtra();
        let listExtraCopy = [...this.state.listExtra];
        if (!check) {
            let addExtra = {
                id: Date.now(),
                reporterId: this.props.userInfo.id,
                quantity: '',
                departmentId: this.props.userInfo.departmentId,
                shiftId: this.props.userInfo.shiftId,
                userType: '',
                overtimeId: null,
                repastMId: 1,
                repastEId: null,
                note: null,
                statusId: null,
            }
            listExtraCopy.push(addExtra);
        } else {
            toast.warning('Bạn cần nhập đủ các trường "Tùy chọn" và "Số lượng", nhấn X để hủy bỏ')
        }
        this.setState({
            listExtra: listExtraCopy
        })
    };

    handleEdit = async (item, id) => {
        this.setState((prevState) => {
            if (id === 'edit') { // Lần click vào "edit"
                return {
                    idDisable: item.userId,
                    listUserBeforEdit: _.isEmpty(prevState.listUserBeforEdit) ? [...prevState.listUser] : prevState.listUserBeforEdit,
                    listUser: prevState.listUserBeforEdit.length > 0 ? [...prevState.listUserBeforEdit] : prevState.listUser, // set lại state cho việc click vào edit (lần 2) dòng dưới khi mà không muốn sửa ở dòng trước đó nữa
                    userUpdate: [{ ...item }]
                };
            }

            if (id === "cancelEdit") { // Click vào "cancelEdit"
                return {
                    idDisable: '',
                    listUser: [...prevState.listUserBeforEdit], // Trả về giá trị trước khi edit
                    listUserBeforEdit: [], // Reset lại để đảm bảo khi edit mới, nó lưu lại giá trị đúng
                    userUpdate: []
                };
            }

            if (id === 'editExtra') { // Lần click vào "edit"
                return {
                    idDisableExtra: item.id,
                    listUserBeforEditExtra: _.isEmpty(prevState.listUserBeforEditExtra) ? [...prevState.listExtra] : prevState.listUserBeforEditExtra,
                    listExtra: prevState.listUserBeforEditExtra.length > 0 ? [...prevState.listUserBeforEditExtra] : prevState.listExtra, // set lại state cho việc click vào edit (lần 2) dòng dưới khi mà không muốn sửa ở dòng trước đó nữa
                    extraUpdate: { ...item }
                };
            }

            if (id === "cancelEditExtra") { // Click vào "cancelEdit"
                return {
                    idDisableExtra: '',
                    listExtra: [...prevState.listUserBeforEditExtra], // Trả về giá trị trước khi edit
                    listUserBeforEditExtra: [], // Reset lại để đảm bảo khi edit mới, nó lưu lại giá trị đúng
                    extraUpdate: {}
                };
            }
            return null;
        });
    };

    render() {

        let { listUser, listTime, listStatusUserReport, idDisable, listExtra, idDisableExtra, userUpdate, extraUpdate } = this.state
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
                        {!this.props.allPersonnel || this.props.allPersonnel.length === 0 &&
                            <button style={{ width: "120px" }} type="button" className="btn btn-warning" onClick={() => this.handleSendReport()}>Gửi báo cáo</button>
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
                                                        <td style={{ width: "3%", }}>{index + 1}</td>
                                                        <td style={{ width: "9%", }}>{item.employeeCode}</td>
                                                        <td style={{ width: "10%", }}>{item.fullName}</td>
                                                        <td style={{ width: "11%" }}>
                                                            <Select
                                                                value={!_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id ? userUpdate[0].statusUserId : item.statusUserId}
                                                                options={listStatusUserReport}
                                                                name='statusUserId'
                                                                isDisabled={this.props.allPersonnel && this.props.allPersonnel.length > 0 && idDisable !== item.userId}
                                                                onChange={(selectOptions, actionMeta) => this.handleChangeSelect(selectOptions, actionMeta, item.userId)}
                                                            />
                                                        </td>
                                                        <td style={{ width: "2%" }}>
                                                            <>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    // id={item.id === userUpdate[0].id ? userUpdate[0].userId : item.userId}
                                                                    name="licensed"
                                                                    checked={!_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id ? userUpdate[0].licensed === 1 : item.licensed === 1}
                                                                    // value={0}
                                                                    disabled={
                                                                        !_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id
                                                                            ?
                                                                            userUpdate[0]?.statusUserId?.value === STATUS_REPORT_HR.DI_LAM ||
                                                                            (this.props.allPersonnel && this.props.allPersonnel.length > 0 && idDisable !== userUpdate[0].userId)
                                                                            :
                                                                            item.statusUserId.value === STATUS_REPORT_HR.DI_LAM ||
                                                                            (this.props.allPersonnel && this.props.allPersonnel.length > 0 && idDisable !== item.userId)
                                                                    }
                                                                    onChange={(event) => this.handleCheckBox(event, !_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id ? userUpdate[0] : item)}
                                                                />
                                                                {/* <label className="form-check-label" htmlFor={item.userId}></label> */}
                                                            </>
                                                        </td>
                                                        <td style={{ width: "7%" }}>
                                                            <Select
                                                                value={!_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id ? userUpdate[0].delayId : item.delayId}
                                                                options={listTime}
                                                                name='delayId'
                                                                onChange={(selectOptions, actionMeta) => this.handleChangeSelect(selectOptions, actionMeta, item.userId)}
                                                                isDisabled={
                                                                    !_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id
                                                                        ?
                                                                        userUpdate[0]?.statusUserId?.value === STATUS_REPORT_HR.DI_LAM ||
                                                                        userUpdate[0]?.statusUserId?.value === STATUS_REPORT_HR.NGHI ||
                                                                        (this.props.allPersonnel && this.props.allPersonnel.length > 0 && idDisable !== userUpdate[0].userId)
                                                                        :
                                                                        item.statusUserId.value === STATUS_REPORT_HR.DI_LAM ||
                                                                        item.statusUserId.value === STATUS_REPORT_HR.NGHI ||
                                                                        (this.props.allPersonnel && this.props.allPersonnel.length > 0 && idDisable !== item.userId)
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={!_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id ? userUpdate[0].note ?? "" : item.note ?? ""} // dấu ?? để check giá trị bên phải dấu ?? nếu là null hoặc undefine thì sử dụng giá trị bên trái dấu ??
                                                                onChange={(event) => this.handleChangeInput(event, !_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id ? userUpdate[0] : item)}
                                                                disabled={
                                                                    !_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id
                                                                        ?
                                                                        userUpdate[0]?.statusUserId?.value === STATUS_REPORT_HR.DI_LAM ||
                                                                        (this.props.allPersonnel && this.props.allPersonnel.length > 0 && idDisable !== userUpdate[0].userId)
                                                                        :
                                                                        item.statusUserId.value === STATUS_REPORT_HR.DI_LAM ||
                                                                        (this.props.allPersonnel && this.props.allPersonnel.length > 0 && idDisable !== item.userId)
                                                                }
                                                            />
                                                        </td>
                                                        <td style={{ width: "6%" }}>
                                                            <>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={!_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id ? userUpdate[0].userId : item.userId}
                                                                    name="repastMId"
                                                                    disabled={
                                                                        item.statusUserId.value === STATUS_REPORT_HR.NGHI ||
                                                                        (this.props.allPersonnel && this.props.allPersonnel.length > 0 && idDisable !== item.userId)
                                                                    }
                                                                    // value={1}
                                                                    checked={!_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id ? userUpdate[0].repastMId === 1 : item.repastMId === 1}
                                                                    onChange={(event) => this.handleCheckBox(event, !_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id ? userUpdate[0] : item)}
                                                                />
                                                                {/* <label className="form-check-label" htmlFor={item.userId}></label> */}
                                                            </>
                                                        </td>
                                                        {this.props.allPersonnel && this.props.allPersonnel.length > 0 &&
                                                            <td style={{ width: "6%" }}>
                                                                {idDisable !== item.userId ?
                                                                    <div className='icon-group-handle'>
                                                                        <div className='icon-edit' onClick={() => this.handleEdit(item, 'edit')}>
                                                                            <i className="fas fa-edit" ></i>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <div className='icon-group-handle'>
                                                                        <div className='icon-group-handle-save' onClick={() => this.handleSave(item, 'saveEditPesonel')}>
                                                                            <i className="fas fa-save" ></i>
                                                                        </div>
                                                                        <div className='icon-group-handle-close' onClick={() => this.handleEdit(item, 'cancelEdit')}>
                                                                            <i className="fas fa-window-close" ></i>
                                                                        </div>
                                                                    </div >
                                                                }
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
                                <div className="table-responsive">
                                    <h4>Báo cáo nhân sự khác</h4>
                                    <table className="table">
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
                                            {listExtra && listExtra.length > 0 &&
                                                listExtra.map((item, index) => {
                                                    return (
                                                        <>
                                                            <tr key={item.id}>
                                                                <td style={{ width: "3%" }}>{index + 1}</td>
                                                                <td style={{ width: "9%" }} >
                                                                    <select
                                                                        className="form-select"
                                                                        aria-label="Default select example"
                                                                        value={!_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? extraUpdate.userType : item.userType}
                                                                        disabled={
                                                                            (this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 && idDisableExtra !== item.id && (this.props.allPersonnelExtra.length - index > 0))
                                                                        }
                                                                        onChange={(event) => this.handleSelectExtra(event, !_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? extraUpdate : item)}
                                                                    >
                                                                        <option>Tuy chọn...</option>
                                                                        <option value="KH">Khách hàng</option>
                                                                        <option value="HV">Học việc</option>
                                                                        <option value="TV">Thời vụ</option>
                                                                    </select>
                                                                </td>
                                                                <td style={{ width: "10%" }} >
                                                                    <input
                                                                        type="number"
                                                                        min={1}
                                                                        value={!_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? extraUpdate.quantity : item.quantity}
                                                                        className="form-control "
                                                                        onChange={(event) => this.handleChangeInputExtra(event, !_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? extraUpdate : item, 'quantity')}
                                                                        disabled={
                                                                            (this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 && idDisableExtra !== item.id && (this.props.allPersonnelExtra.length - index > 0))
                                                                        }
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={!_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? extraUpdate.note ?? "" : item.note}
                                                                        onChange={(event) => this.handleChangeInputExtra(event, !_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? extraUpdate : item, 'note')}
                                                                        disabled={
                                                                            (this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 && idDisableExtra !== item.id && (this.props.allPersonnelExtra.length - index > 0))
                                                                        }
                                                                    /></td>
                                                                <td style={{ width: "6%" }}>
                                                                    <>
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            // id={item.userId}
                                                                            name="repastMId"
                                                                            disabled={
                                                                                (this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 && idDisableExtra !== item.id && (this.props.allPersonnelExtra.length - index > 0))
                                                                            }
                                                                            // value={1}
                                                                            checked={!_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? (extraUpdate.repastMId ?? 0) === 1 : item.repastMId === 1}
                                                                            onChange={(event) => this.handleCheckBoxExtra(event, !_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? extraUpdate : item)}
                                                                        />
                                                                        {/* <label className="form-check-label" htmlFor={item.userId}></label> */}
                                                                    </>
                                                                </td>
                                                                {((this.props.allPersonnelExtra && this.props.allPersonnelExtra.length === 0) || index >= this.props.allPersonnelExtra.length) &&
                                                                    < td style={{ width: "6%" }}>
                                                                        <div className=' icon-group-handle'>
                                                                            <div className='icon-group-handle-trash' onClick={(event) => this.HandleDeleteExtra(event, item, index)}>
                                                                                <i className="far fa-trash-alt"></i>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                }
                                                                {this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 && (this.props.allPersonnelExtra.length - index > 0) &&
                                                                    < td style={{ width: "6%" }}>
                                                                        {idDisableExtra !== item.id ?
                                                                            <div className=' icon-group-handle'>
                                                                                <div className='icon-edit' onClick={() => this.handleEdit(item, 'editExtra')}>
                                                                                    <i className="fas fa-edit"></i>
                                                                                </div>
                                                                                <div className='icon-group-handle-trash' onClick={(event) => this.HandleDeleteExtra(event, item, index)}>
                                                                                    <i className="far fa-trash-alt"></i>
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <div className='icon-group-handle'>
                                                                                <div className='icon-group-handle-save' onClick={() => this.handleSave(item, 'saveEditExtra')}>
                                                                                    <i className="fas fa-save"></i>
                                                                                </div>
                                                                                <div className='icon-group-handle-close' onClick={() => this.handleEdit(item, 'cancelEditExtra')}>
                                                                                    <i className="fas fa-window-close"></i>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                }
                                                            </tr >
                                                        </>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                {this.props.allPersonnelExtra && this.props.allPersonnelExtra.length > 0 &&
                                    <div >
                                        <button style={{ width: "55px" }} type="button" className="btn btn-success" onClick={() => this.handleAddExtra()} >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                        {this.props.allPersonnelExtra.length - listExtra.length < 0 &&
                                            <>
                                                <button style={{ width: "55px", margin: "0 10px" }} type="button" className="btn btn-danger" onClick={() => this.handleCancelExtra()}>
                                                    <i className="fas fa-times fa-lg"></i>
                                                </button>
                                                <button type="button" className="btn btn-warning" onClick={() => this.UpdateAddNewExtra()}>Update</button>
                                            </>
                                        }
                                    </div>
                                }
                                {this.props.allPersonnelExtra && this.props.allPersonnelExtra.length === 0 &&
                                    <>
                                        <button style={{ width: "55px" }} type="button" className="btn btn-success" onClick={() => this.handleAddExtra()} >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                        <button style={{ width: "55px", marginLeft: "10px" }} type="button" className="btn btn-danger" onClick={() => this.handleCancelExtra()}>
                                            <i className="fas fa-times fa-lg"></i>
                                        </button>
                                        {this.props.allPersonnel.length > 0 &&
                                            <button style={{ marginLeft: "10px" }} type="button" className="btn btn-warning" onClick={() => this.UpdateAddNewExtra()}>Update</button>
                                        }
                                    </>
                                }
                            </>
                            :
                            <div>
                                <button style={{ padding: "0" }} type="button" className="btn" onClick={() => this.handleShowHide()}>
                                    <i className="fas fa-user-plus"></i>
                                </button>
                            </div>
                        }
                    </div>

                    <div className='personel-footer'>
                        <HomeFooter />
                    </div>
                    <ModalPersonel
                        isOpenModal={this.state.isOpenModal}
                        handleCloseModal={this.handleCloseModal}
                        handleOvertimeReport={this.handleSave}
                        resetModal={this.state.resetModal}
                        onResetModal={() => this.setState({ resetModal: false })}
                    />
                </div >

            </>
        )
    }
}

const mapStateToProps = state => {

    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        allPersonnel: state.user.allPersonnel,
        allPersonnelExtra: state.user.allPersonnelExtra,
        allSelectPersonnel: state.user.allSelectPersonnel,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // handleDataHomeRedux: (data) => dispatch(actions.handleDataHomeRedux(data)),
        getAllPersonnelRedux: (dataDay, shiftsId, departmentId) => dispatch(actions.getAllPersonnelRedux(dataDay, shiftsId, departmentId)),
        getAllPersonnelExtraRedux: (dataDay, shiftsId, departmentId) => dispatch(actions.getAllPersonnelExtraRedux(dataDay, shiftsId, departmentId)),
        getAllSelectPersonnelRedux: () => dispatch(actions.getAllSelectPersonnelRedux())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Personnel));
