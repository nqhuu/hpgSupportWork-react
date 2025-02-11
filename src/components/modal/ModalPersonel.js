import { Modal } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import './ModalPersonel.scss'
import * as actions from "../../redux/actions";
import Select from 'react-select';
import { over, values } from 'lodash';
import { CODE, VALUE, DATA_TABLE, STATUS_REPORT_HR, STATUS_REPORT_HR_ID } from '../../ultil/constant';
import { uploadsFile } from '../../services/userService'
import handleUploadFile from "../../config/HandleUploadFile"
import { handleCreateRequest, updateRequestSupport } from "../../services/userService"
import _ from 'lodash'




class ModalPersonel extends Component {

    state = {
        listUser: [],
        listExtra: [],
        checked: false,
        showHideChecked: false,
        checkedRepast: false,
        showHidecheckedRepast: false,
        showHideEditCheckAll: false,
        idDisable: '',
        idDisableExtra: '',
        listUserBeforEdit: []
    }

    async componentDidMount() {

    }


    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.allPersonnel !== this.props.allPersonnel) {
            let allPersonnelRedux = this.props.allPersonnel
            let allPersonnel = allPersonnelRedux.map((item, index) => {
                item.fullName = `${item.personnelReportData.firstName} ${item.personnelReportData.lastName}`;
                // item.employeeCode = item.personnelReportData.employeeCode;
                // item.statusUserId = listStatusUserReport.filter(status => item.statusUserId === status.value)[0];
                // if (item.delayId) item.delayId = listTime.filter(time => item.delayId === +time.label)[0];
                return item;
            })
            let allPersonnelToWork = []

            if (allPersonnel && allPersonnel.length > 0) {
                allPersonnelToWork = allPersonnel.filter(item => item.statusUserId.value !== STATUS_REPORT_HR.NGHI)
            }
            this.setState({
                listUser: allPersonnelToWork
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
        //     this.setState({
        //         listExtra: allPersonnelExtra,
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
        this.setState({

        })
    }

    handleChangeSelect = (selectOptions, actionMeta) => {
        console.log(actionMeta)
    }

    handleCheckedAll = (id) => {
        this.setState(
            { [id]: !this.state[id] },
            async () => {
                if (id === 'checked') {
                    let listUserCopy = [...this.state.listUser];
                    if (listUserCopy.length > 0) {
                        listUserCopy = listUserCopy.map(item => ({
                            ...item,
                            statusId: this.state.checked
                                ? STATUS_REPORT_HR_ID.TANG_CA
                                : STATUS_REPORT_HR_ID.DI_LAM
                        }));
                        this.setState({ listUser: listUserCopy });
                    }
                }

                if (id === 'checkedRepast') {
                    let listUserCopy = [...this.state.listUser];
                    if (listUserCopy.length > 0) {
                        listUserCopy = listUserCopy.map(item => ({
                            ...item,
                            repastEId: this.state.checkedRepast ? 1 : 0
                        }));
                        this.setState({ listUser: listUserCopy });
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

        this.setState((prevState) => ({
            listUser: prevState.listUser.map((user) =>
                user.id === updatedItem.id ? updatedItem : user,
            ),
        }));


        // if (this.props.allPersonnel && this.props.allPersonnel.length > 0) {
        //     this.setState((prevState) => ({
        //         userUpdate: updatedItem
        //     }));
        // } else {
        //     this.setState((prevState) => ({
        //         listUser: prevState.listUser.map((user) =>
        //             user.userId === updatedItem.userId ? updatedItem : user
        //         ),
        //     }));
        // }

    };

    handleChangeInputExtra = async (event, item, id) => {
        let updatedItem = {}
        if (id === 'overtimeId') {
            if (item.statusId !== STATUS_REPORT_HR_ID.TANG_CA) {
                toast.warning('Bạn phải tăng ca mới có thể báo thời gian')
                return;
            }

            let overtimeId = +event.target.value;

            if (+overtimeId < 0.5) {
                toast.warning('Thời gian tăng ca tối thiểu là 30')
                return;
            }

            updatedItem = {
                ...item,
                [id]: +event.target.value > 0.5 ? +event.target.value : null, // Thêm hoặc cập nhật thuộc tính giá trị. 
            };
        }

        this.setState((prevState) => ({
            listUser: prevState.listUser.map((user) =>
                user.userId === updatedItem.userId ? updatedItem : user,
            ),
        }));

    };

    handleShowHideSelectAll = () => {
        this.setState(prevState => {
            if (!this.state.showHideEditCheckAll) {
                return {
                    showHideEditCheckAll: true,
                    listUserBeforEdit: _.isEmpty(prevState.listUserBeforEdit) ? [...prevState.listUser] : prevState.listUserBeforEdit,
                    listUser: prevState.listUserBeforEdit.length > 0 ? [...prevState.listUserBeforEdit] : prevState.listUser, // set lại state cho việc click vào edit (lần 2) dòng dưới khi mà không muốn sửa ở dòng trước đó nữa    
                }
            }

            if (this.state.showHideEditCheckAll) {
                return {
                    showHideEditCheckAll: false,
                    listUser: [...prevState.listUserBeforEdit], // Trả về giá trị trước khi edit
                    listUserBeforEdit: [], // Reset lại để đảm bảo khi edit mới, nó lưu lại giá trị đúng
                    checked: false,
                    checkedRepast: false,
                }
            }
        });
    }

    handleEdit = (item, id) => {
        this.setState(prevState => {
            if (id === 'edit') {
                return {
                    idDisable: item.id,
                    listUserBeforEdit: _.isEmpty(prevState.listUserBeforEdit) ? [...prevState.listUser] : prevState.listUserBeforEdit,
                    listUser: prevState.listUserBeforEdit.length > 0 ? [...prevState.listUserBeforEdit] : prevState.listUser, // set lại state cho việc click vào edit (lần 2) dòng dưới khi mà không muốn sửa ở dòng trước đó nữa
                };
            }

            if (id === 'close') {
                return {
                    idDisable: '',
                    listUser: [...prevState.listUserBeforEdit], // Trả về giá trị trước khi edit
                    listUserBeforEdit: [], // Reset lại để đảm bảo khi edit mới, nó lưu lại giá trị đúng
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



    render() {
        let {
            listUser, checked,
            checkedRepast, idDisable, handleShowHideSelectAll
        } = this.state

        let hasOvertime = this.props.allPersonnel.some(item => item.statusId === STATUS_REPORT_HR_ID.TANG_CA);

        console.log('state', this.state)
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
                            {/* <i className="fa fa-times" aria-hidden="true"></i> */}
                        </span>
                    </div>

                    <div className='modal-hr-body '>
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã NV</th>
                                    <th>Họ Tên</th>
                                    {/* Cột Tăng Ca */}
                                    <th>
                                        {this.renderCheckboxAll('checked', checked)}
                                        <span>Tăng ca</span>
                                    </th>
                                    <th>Thời gian</th>
                                    {/* Cột Ăn Nhẹ */}
                                    <th>
                                        {this.renderCheckboxAll('checkedRepast', checkedRepast)}
                                        <span style={{ marginLeft: '5px' }}>Ăn nhẹ</span>
                                    </th>
                                    {/* Cột Hành Động */}
                                    {hasOvertime && (
                                        <th>
                                            <span style={{ marginRight: '5px' }}>Hành Động</span>
                                            <i
                                                className={this.state.showHideEditCheckAll ? "fas fa-window-close" : "fas fa-edit"}
                                                onClick={this.handleShowHideSelectAll}
                                            ></i>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {listUser && listUser.length > 0 &&
                                    listUser.map((item, index) => {

                                        let user = this.props.allPersonnel.find(itemR => itemR.id === item.id)
                                        let isOvertime = item.statusId === STATUS_REPORT_HR_ID.TANG_CA;
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
                                                    <td style={{ width: "15%", }}>{item.employeeCode}</td>
                                                    <td style={{ width: "20%", }}>{item.fullName}</td>
                                                    <td style={{ width: "10%" }}>
                                                        <>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="statusId"
                                                                checked={isOvertime}
                                                                // value={0}
                                                                disabled={isDisabledCheckBoxOvertime}
                                                                // onChange={(event) => this.handleCheckBox(event, !_.isEmpty(userUpdate) && item.id === userUpdate.id ? userUpdate : item)}
                                                                onChange={(event) => this.handleCheckBox(event, item, 'statusId')}
                                                            />
                                                        </>
                                                    </td>
                                                    <td style={{ width: "10%" }} >
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            // value={!_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? extraUpdate.quantity : item.quantity}
                                                            value={item.overtimeId}
                                                            className="form-control "
                                                            disabled={isDisabledOvertimeInput}
                                                            // onChange={(event) => this.handleChangeInputExtra(event, !_.isEmpty(extraUpdate) && item.id === extraUpdate.id ? extraUpdate : item, 'quantity')}
                                                            onChange={(event) => this.handleChangeInputExtra(event, item, 'overtimeId')}
                                                        />
                                                    </td>
                                                    <td style={{ width: "10%" }}>
                                                        <>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="repastEId"
                                                                checked={item.repastEId === 1}
                                                                disabled={isDisabledRepastE}
                                                                // onChange={(event) => this.handleCheckBox(event, !_.isEmpty(userUpdate) && item.id === userUpdate.id ? userUpdate : item)}
                                                                onChange={(event) => this.handleCheckBox(event, item, 'repastEId')}
                                                            // onChange={item.statusId === STATUS_REPORT_HR_ID.TANG_CA ? (event) => this.handleCheckBox(event, item, 'repastEId') : undefined} // không cho tick khi chưa báo tăng ca
                                                            />
                                                        </>
                                                    </td>
                                                    {user && user.statusId === STATUS_REPORT_HR_ID.TANG_CA && idDisable !== item.id &&
                                                        <td>
                                                            <i className="fas fa-edit" onClick={() => this.handleEdit(item, 'edit')}></i>
                                                        </td>
                                                    }
                                                    {idDisable === item.id &&
                                                        <td>
                                                            <i className="fas fa-save" ></i>
                                                            <i className="fas fa-window-close" onClick={() => this.handleEdit(item, 'close')} ></i>
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
                </div>

                <div className='modal-hr-footer'>
                    <button
                        type="button" className="btn btn-primary btn-modal"
                        onClick={() => this.handleCreateRequestUi()}
                    >
                        Xác nhận
                    </button>
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
