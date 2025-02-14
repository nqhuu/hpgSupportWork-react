import { Modal } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import './ModalPersonel.scss'
import * as actions from "../../redux/actions";
import Select from 'react-select';
import { over, values } from 'lodash';
import { STATUS_USER_TYPE_EXTRA, STATUS_REPORT_HR, STATUS_REPORT_HR_ID, } from '../../ultil/constant';
import { uploadsFile } from '../../services/userService'
import handleUploadFile from "../../config/HandleUploadFile"
import { handleCreateRequest, updateRequestSupport } from "../../services/userService"
import _ from 'lodash'




class ModalPersonel extends Component {

    state = {
        listUserModal: [],
        listExtra: [],
        userUpdate: [],
        checkedOverAll: false,
        showHideChecked: false,
        checkedRepastAll: false,
        // showHidecheckedRepast: false,
        showHideEditCheckAll: false,
        idDisable: '',
        idDisableExtra: '',
        listUserModalBeforEdit: [],
        showHideExtra: false

    }

    async componentDidMount() {

    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.resetModal !== this.props.resetModal && this.props.resetModal) {
            this.setState({
                showHideEditCheckAll: false
            });
            // Tắt cờ reset sau khi reset state modal
            this.props.onResetModal();
        }

        if (prevProps.allPersonnel !== this.props.allPersonnel) {
            let allPersonnelRedux = this.props.allPersonnel

            let allPersonnel = allPersonnelRedux.map((item) => ({
                ...item,
                fullName: `${item.personnelReportData.firstName} ${item.personnelReportData.lastName}`
            }));

            console.log('allPersonnel', allPersonnel)


            let allPersonnelToWork = [] // danh sách nhân viên đi làm
            if (allPersonnel && allPersonnel.length > 0) {
                allPersonnelToWork = allPersonnel.filter(item => item.statusUserId !== STATUS_REPORT_HR.NGHI)  ///////////////////// lưu ý phần này, đang bị chuyển thành string thay vì item.statusUserId.value
            }

            this.setState({
                listUserModal: allPersonnelToWork,
                listUserModalBeforEdit: allPersonnelToWork
            })
        };

        // if (prevProps.allPersonnelExtra !== this.props.allPersonnelExtra) {
        //     let allPersonnelExtraRedux = [...this.props.allPersonnelExtra]
        //     let allPersonnelExtra = allPersonnelExtraRedux.map((item, index) => {
        //         let newItem = { ...item }
        //         delete newItem.createdAt;
        //         delete newItem.personnelExtraReportData;
        //         delete newItem.updatedAt;
        //         return newItem
        //     })
        //     let allPersonnelExtraReduxManufacture = [] // danh sách nhân viên thuộc cty
        //     allPersonnelExtraReduxManufacture = allPersonnelExtra.filter(item => item.userType !== STATUS_USER_TYPE_EXTRA.KHACH_HANG)
        //     this.setState({
        //         listExtra: allPersonnelExtraReduxManufacture,
        //         showHideExtra: true,
        //     })
        // }
    }

    handleOnchangeInput = (e, id) => {
        let copyState = { ...this.state };
        copyState[id] = e.target.value;
        this.setState({
            ...copyState
        })
    }

    handleCloseModal = () => {
        this.props.handleCloseModal()
        this.setState(prevState => ({
            showHideEditCheckAll: false,
            listUserModal: prevState.listUserModalBeforEdit.length > 0 ? [...prevState.listUserModalBeforEdit] : prevState.listUserModal, // set lại state cho việc click vào edit (lần 2) dòng dưới khi mà không muốn sửa ở dòng trước đó nữa
            checkedOverAll: false,
            checkedRepastAll: false,
            idDisable: '',
        }))
    }

    handleCheckedAll = (id) => {
        const shouldShowCheckbox = this.props.allPersonnel.some(item => item.statusId === STATUS_REPORT_HR_ID.TANG_CA)

        this.setState((prevState) =>
        ({
            [id]: !this.state[id],
            listUserModalBeforEdit: _.isEmpty(prevState.listUserModalBeforEdit)
                ?
                [...prevState.listUserModal.map(item => {
                    if (item.overtimeId === null) item.overtimeId = "";
                    return item
                })]
                :
                prevState.listUserModalBeforEdit,
            // listUserModal: prevState.listUserModalBeforEdit.length > 0 ? [...prevState.listUserModalBeforEdit] : prevState.listUserModal, // set lại state cho việc click vào edit (lần 2) dòng dưới khi mà không muốn sửa ở dòng trước đó nữa    
        }),
            async () => {
                if (id === 'checkedOverAll') {
                    let listUserCopy = [...this.state.listUserModal];
                    if (listUserCopy.length > 0) {
                        listUserCopy = listUserCopy.map(item => ({
                            ...item,
                            statusId: this.state.checkedOverAll
                                ? STATUS_REPORT_HR_ID.TANG_CA
                                : STATUS_REPORT_HR_ID.DI_LAM,
                            repastEId: this.state.checkedOverAll ? 0 : null,
                            overtimeId: this.state.checkedOverAll ? 1 : "",
                        }));
                    }
                    this.setState({
                        listUserModal: listUserCopy,
                        checkedRepastAll: !this.state.checkedOverAll && !this.state.checkedRepastAll
                    });
                }
                if (this.state.checkedOverAll) {
                    if (id === 'checkedRepastAll') {
                        let listUserCopy = [...this.state.listUserModal];
                        if (listUserCopy.length > 0) {
                            listUserCopy = listUserCopy.map(item => ({
                                ...item,
                                repastEId: item.statusId === STATUS_REPORT_HR_ID.TANG_CA && this.state.checkedRepastAll ? 1 : 0
                            }));
                        }
                        this.setState({ listUserModal: listUserCopy });
                    }
                }
            }
        );
    }

    handleCheckBox = async (event, item, id) => {
        let updatedItem = {}
        if (id === 'statusId') {
            updatedItem = {
                ...item,
                [event.target.name]: event.target.checked === true ? STATUS_REPORT_HR_ID.TANG_CA : STATUS_REPORT_HR_ID.DI_LAM, // Thêm hoặc cập nhật thuộc tính giá trị. 
                repastEId: event.target.checked && 0,
                overtimeId: event.target.checked && 1,
            };
            if (event.target.checked === false) {
                updatedItem.repastEId = null
                updatedItem.overtimeId = ""
            };
        }

        if (id === 'repastEId') {
            if (item.statusId === STATUS_REPORT_HR_ID.TANG_CA) {
                updatedItem = {
                    ...item,
                    [event.target.name]: event.target.checked === true ? 1 : 0, // Thêm hoặc cập nhật thuộc tính giá trị
                }
            } else {
                toast.warning('Bạn phải tăng ca mới có thể báo ăn nhẹ')
                return;
            }

        }
        if (this.state.userUpdate && this.state.userUpdate.length > 0) {
            this.setState((prevState) => ({
                userUpdate: [{ ...updatedItem }]
            }));
        } else
            this.setState((prevState) => ({
                listUserModal: prevState.listUserModal.map((user) =>
                    user.id === updatedItem.id ? updatedItem : user,
                ),
            }));


        // if (this.props.allPersonnel && this.props.allPersonnel.length > 0) {
        //     this.setState((prevState) => ({
        //         userUpdate: updatedItem
        //     }));
        // } else {
        //     this.setState((prevState) => ({
        //         listUserModal: prevState.listUserModal.map((user) =>
        //             user.userId === updatedItem.userId ? updatedItem : user
        //         ),
        //     }));
        // }

    };

    handleChangeInputExtra = async (event, item, id) => {
        let updatedItem = {}
        let overtimeId = +event.target.value;

        if (id === 'overtimeId') {
            if (item.statusId !== STATUS_REPORT_HR_ID.TANG_CA) {
                toast.warning('Bạn phải tăng ca mới có thể báo thời gian')
                return;
            }

            if (+overtimeId < 1) {
                toast.warning('Thời gian tăng ca tối thiểu là 1 giờ')
                return;
            }

            updatedItem = {
                ...item,
                [id]: +event.target.value >= 1 ? +event.target.value : null, // Thêm hoặc cập nhật thuộc tính giá trị. 
            };
        }

        if (id === "overtimeIdAll") {
            this.setState((prevState) => ({
                listUserModal: prevState.listUserModal.map((user) => {
                    user.overtimeId = user.statusId === STATUS_REPORT_HR_ID.TANG_CA ? overtimeId : '';
                    return user;
                }),
            }));
        }

        this.setState((prevState) => ({
            listUserModal: prevState.listUserModal.map((user) =>
                user.userId === updatedItem.userId ? updatedItem : user,
            ),
        }));

    };

    handleShowHideSelectAll = () => {
        this.setState(prevState => {
            if (!this.state.showHideEditCheckAll) {
                return {
                    idDisable: '',
                    showHideEditCheckAll: !this.state.showHideEditCheckAll,
                    listUserModalBeforEdit: _.isEmpty(prevState.listUserModalBeforEdit) ? [...prevState.listUserModal] : prevState.listUserModalBeforEdit,
                    listUserModal: prevState.listUserModalBeforEdit.length > 0 ? [...prevState.listUserModalBeforEdit] : prevState.listUserModal, // set lại state cho việc click vào edit (lần 2) dòng dưới khi mà không muốn sửa ở dòng trước đó nữa    
                    checkedOverAllBeforEdit: prevState.checkedOverAll,
                    checkedRepastAllBeforEdit: prevState.checkedRepastAll,
                }
            }

            if (this.state.showHideEditCheckAll) {
                return {
                    showHideEditCheckAll: !this.state.showHideEditCheckAll,
                    listUserModal: [...prevState.listUserModalBeforEdit], // Trả về giá trị trước khi edit
                    // listUserModalBeforEdit: [], // Reset lại để đảm bảo khi edit mới, nó lưu lại giá trị đúng
                    checkedOverAllBeforEdit: "",
                    checkedRepastAllBeforEdit: "",
                    checkedOverAll: prevState.checkedOverAllBeforEdit,
                    checkedRepastAll: prevState.checkedRepastAllBeforEdit,
                }
            }
        });
    }

    handleEdit = (item, id) => {
        this.setState(prevState => {
            if (id === 'edit') {
                return {
                    userUpdate: [{ ...item }],
                    idDisable: item.id,
                    listUserModalBeforEdit: _.isEmpty(prevState.listUserModalBeforEdit) ? [...prevState.listUserModal] : prevState.listUserModalBeforEdit,
                    listUserModal: prevState.listUserModalBeforEdit.length > 0 ? [...prevState.listUserModalBeforEdit] : prevState.listUserModal, // set lại state cho việc click vào edit (lần 2) dòng dưới khi mà không muốn sửa ở dòng trước đó nữa
                };
            }

            if (id === 'close') {
                return {
                    userUpdate: [],
                    idDisable: "",
                    listUserModal: [...prevState.listUserModalBeforEdit], // Trả về giá trị trước khi edit
                    // listUserModalBeforEdit: [], // Reset lại để đảm bảo khi edit mới, nó lưu lại giá trị đúng
                };
            }
        });
    }

    renderCheckboxAll = (type, isChecked) => {
        const { allPersonnel } = this.props;
        const { showHideEditCheckAll } = this.state;

        // Điều kiện hiển thị checkbox
        const shouldShowCheckbox =
            (allPersonnel.some(item => item.statusId === STATUS_REPORT_HR_ID.TANG_CA) && showHideEditCheckAll) ||
            (allPersonnel.every(item => item.statusId !== STATUS_REPORT_HR_ID.TANG_CA));

        return shouldShowCheckbox && (
            <span className="icon-checkbox-all" onClick={() => this.handleCheckedAll(type)}>
                <i className={`far ${isChecked ? "fa-check-square" : "fa-square"} `} style={{ marginRight: '5px' }}></i>
            </span>
        );
    };

    renderSelectNumberAll = (type, isSelect) => {
        const { allPersonnel } = this.props;
        const { showHideEditCheckAll } = this.state;

        // Điều kiện hiển thị checkbox
        const shouldShowCheckbox =
            (allPersonnel.some(item => item.statusId === STATUS_REPORT_HR_ID.TANG_CA) && showHideEditCheckAll) ||
            (allPersonnel.every(item => item.statusId !== STATUS_REPORT_HR_ID.TANG_CA));

        return shouldShowCheckbox && (
            <input
                type="number"
                min={1}
                // value={item.overtimeId}
                className="th-input-number"
                disabled={!this.state.checkedOverAll}
                onChange={(event) => this.handleChangeInputExtra(event, type, isSelect)}
            />
        );
    }

    handleOvertimeReportModal = async () => {
        let dataUpdate = await this.state.listUserModal.filter((item, index) => {
            return item.statusId === STATUS_REPORT_HR_ID.TANG_CA
        })
        for (let item of dataUpdate) {
            if (!item.overtimeId) {
                toast.error('Bạn cần nhập thời gian tăng ca dự kiến');
                break; // Dừng vòng lặp ngay lập tức
            }
        }

        if (this.state.listUserModal && this.state.listUserModal.length > 0) { // gửi dữ liệu sang bên personnel
            this.props.handleOvertimeReport(this.state.listUserModal, 'overtimeReport')
        }
    }


    render() {
        console.log(this.state)

        let {
            listUserModal, checkedOverAll, userUpdate,
            checkedRepastAll, idDisable, showHideEditCheckAll
        } = this.state

        let hasOvertime = this.props.allPersonnel.some(item => item.statusId === STATUS_REPORT_HR_ID.TANG_CA);

        return (
            <Modal
                isOpen={this.props.isOpenModal}
                backdrop={true}
                size='xl'
                className='Modal-hr-container'
            >
                <div className='modal-hr-content'>
                    <div className='modal-hr-header'>
                        <span className='content-header'>
                            Báo tăng ca
                        </span>
                        <span
                            className='btn-close'
                            onClick={() => this.handleCloseModal()}
                        >
                        </span>
                    </div>

                    <div className='modal-hr-body '>
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã NV</th>
                                    <th>Họ Tên</th>
                                    <th>
                                        {this.renderCheckboxAll('checkedOverAll', checkedOverAll)}
                                        <span>Tăng ca</span>
                                    </th>
                                    <th className="th-flex">
                                        {this.state.checkedOverAll && this.renderSelectNumberAll("", 'overtimeIdAll')}
                                        <span className='th-time'>Thời gian</span>
                                    </th>
                                    <th>
                                        {this.state.checkedOverAll && this.renderCheckboxAll('checkedRepastAll', checkedRepastAll)}
                                        <span style={{ marginLeft: '5px' }}>Ăn nhẹ</span>
                                    </th>
                                    {hasOvertime && (
                                        <th>
                                            {/* <span style={{ marginRight: '5px' }}>Hành Động</span> */}
                                            <i
                                                className={this.state.showHideEditCheckAll ? "fas fa-window-close icon-close" : "fas fa-edit icon-edit"}
                                                onClick={this.handleShowHideSelectAll}
                                            ></i>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className='moda-hr-body-tbody'>
                                {listUserModal && listUserModal.length > 0 &&
                                    listUserModal.map((item, index) => {
                                        let user = this.props.allPersonnel.find(itemR => itemR.id === item.id)
                                        let isOvertime = !_.isEmpty(userUpdate) ? userUpdate[0].statusId === STATUS_REPORT_HR_ID.TANG_CA : item.statusId === STATUS_REPORT_HR_ID.TANG_CA;
                                        let isDisabledCheckBoxOvertime = this.state.showHideEditCheckAll ? false : (user ? (user.statusId === STATUS_REPORT_HR_ID.TANG_CA && idDisable !== item.id) : false);
                                        let isDisabledOvertimeInput = this.state.showHideEditCheckAll
                                            ? (item.statusId === STATUS_REPORT_HR_ID.TANG_CA ? false : true) // Nếu mở hết input, chỉ cho phép khi item.statusId === TANG_CA
                                            : (user
                                                ? (user.statusId === STATUS_REPORT_HR_ID.TANG_CA && idDisable !== item.id
                                                    ? true  // Nếu user từ Redux có status TANG_CA → luôn disabled
                                                    : (item.statusId === STATUS_REPORT_HR_ID.TANG_CA ? false : true) // Nếu không, kiểm tra item từ state
                                                )
                                                : true // Nếu không có user → disabled
                                            );

                                        let isDisabledRepastE = this.state.showHideEditCheckAll
                                            ? (item.statusId === STATUS_REPORT_HR_ID.TANG_CA ? false : true) // Nếu mở hết input, chỉ cho phép khi item.statusId === TANG_CA
                                            : (user
                                                ? (user.statusId === STATUS_REPORT_HR_ID.TANG_CA && idDisable !== item.id
                                                    ? true  // Nếu user từ Redux có status TANG_CA → luôn disabled
                                                    : (item.statusId === STATUS_REPORT_HR_ID.TANG_CA ? false : true) // Nếu không, kiểm tra item từ state
                                                )
                                                : true // Nếu không có user → disabled
                                            );

                                        return (
                                            <>
                                                <tr key={item.id}>
                                                    <td style={{ width: "3%", }}>{index + 1}</td>
                                                    <td style={{ width: "24%", }}>{item.personnelReportData.employeeCode}</td>
                                                    <td style={{ width: "25%", }}>{item.fullName}</td>
                                                    <td style={{ width: "10%" }}>
                                                        <input
                                                            className="form-check-input moda-hr-body-tbody-icon-check-box"
                                                            type="checkbox"
                                                            name="statusId"
                                                            checked={isOvertime}
                                                            // value={0}
                                                            disabled={isDisabledCheckBoxOvertime}
                                                            onChange={(event) => this.handleCheckBox(event, !_.isEmpty(userUpdate) && item.id === userUpdate[0].id ? userUpdate[0] : item, 'statusId')}
                                                        />
                                                    </td>
                                                    <td style={{ width: "15%" }} >
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={item.overtimeId > 0 ? item.overtimeId : ""}
                                                            // value={!_.isEmpty(userUpdate) && userUpdate[0] && userUpdate[0].overtimeId > 0 ? (userUpdate[0].overtimeId || "") : (item?.overtimeId || "")}
                                                            className="form-control "
                                                            disabled={isDisabledOvertimeInput}
                                                            onChange={(event) => this.handleChangeInputExtra(event, item, 'overtimeId')}
                                                        />
                                                    </td>
                                                    <td style={{ width: "15%" }}>
                                                        <>
                                                            <input
                                                                className="form-check-input moda-hr-body-tbody-icon-check-box"
                                                                type="checkbox"
                                                                name="repastEId"
                                                                checked={item.repastEId === 1}
                                                                // checked={!_.isEmpty(userUpdate) ? userUpdate[0].repastEId === 1 : item.repastEId === 1}
                                                                disabled={isDisabledRepastE}
                                                                onChange={(event) => this.handleCheckBox(event, item, 'repastEId')}
                                                            />
                                                        </>
                                                    </td>
                                                    {/* {(user && user.statusId === STATUS_REPORT_HR_ID.TANG_CA && idDisable !== item.id && !showHideEditCheckAll) ?
                                                        <td style={{ width: "20%" }}>
                                                            <i className="fas fa-edit moda-hr-body-tbody-icon-edit" onClick={() => this.handleEdit(item, 'edit')}></i>
                                                        </td>
                                                        :
                                                        ""
                                                    }
                                                    {idDisable === item.id && !showHideEditCheckAll &&
                                                        <td style={{ width: "20%" }}>
                                                            <i className="fas fa-save moda-hr-body-tbody-icon-save"  ></i>
                                                            <i className="fas fa-window-close moda-hr-body-tbody-icon-close" onClick={() => this.handleEdit(item, 'close')} ></i>
                                                        </td>
                                                    } */}
                                                </tr>
                                            </>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {/* {this.state.showHideExtra &&
                            <div className="table-responsive">
                                <h5>Báo cáo nhân sự khác</h5>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tùy chọn</th>
                                            <th>Số lượng</th>
                                            <th>Ghi chú</th>
                                            <th>Tăng ca</th>
                                            <th>Thời gian</th>
                                            <th>Ăn nhẹ</th>
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
                                                                {item.userType}
                                                            </td>
                                                            <td style={{ width: "10%" }} >
                                                                {item.quantity}
                                                            </td>
                                                            <td>{item.note}</td>
                                                            <td style={{ width: "10%" }}>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    name="statusId"
                                                                    checked={item.overtimeId || ""}
                                                                    // value={0}
                                                                    // disabled={isDisabledCheckBoxOvertime}
                                                                    // onChange={(event) => this.handleCheckBox(event, !_.isEmpty(userUpdate) && item.id === userUpdate.id ? userUpdate : item)}
                                                                    onChange={(event) => this.handleCheckBox(event, item, 'statusId')}
                                                                />
                                                            </td>
                                                            <td style={{ width: "10%" }} >
                                                                <input
                                                                    type="number"
                                                                    min={1}
                                                                    // value={!_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? extraUpdate.quantity : item.quantity}
                                                                    value={item.overtimeId}
                                                                    className="form-control "
                                                                    // disabled={isDisabledOvertimeInput}
                                                                    // onChange={(event) => this.handleChangeInputExtra(event, !_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? extraUpdate : item, 'quantity')}
                                                                    onChange={(event) => this.handleChangeInputExtra(event, item, 'overtimeId')}
                                                                />
                                                            </td>
                                                            <td style={{ width: "10%" }}>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    name="repastEId"
                                                                    checked={item.repastEId === 1}
                                                                    // disabled={isDisabledRepastE}
                                                                    // onChange={(event) => this.handleCheckBox(event, !_.isEmpty(userUpdate) && item.id === userUpdate.id ? userUpdate : item)}
                                                                    onChange={(event) => this.handleCheckBox(event, item, 'repastEId')}
                                                                // onChange={item.statusId === STATUS_REPORT_HR_ID.TANG_CA ? (event) => this.handleCheckBox(event, item, 'repastEId') : undefined} // không cho tick khi chưa báo tăng ca
                                                                />
                                                            </td>
                                                        </tr >
                                                    </>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        } */}
                    </div>
                </div>

                <div className='modal-hr-footer'>
                    {((hasOvertime && showHideEditCheckAll) || !hasOvertime) &&
                        <button
                            type="button" className="btn btn-primary btn-modal"
                            onClick={() => this.handleOvertimeReportModal()}
                        >
                            Xác nhận
                        </button>
                    }

                    <button
                        type="button" className="btn btn-danger btn-modal"
                        onClick={() => this.handleCloseModal()}
                    >
                        Đóng
                    </button>
                </div>
            </Modal >
        );
    }

}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
        allPersonnel: state.user.allPersonnel,
        allPersonnelExtra: state.user.allPersonnelExtra,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalPersonel);
