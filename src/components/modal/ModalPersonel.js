import { Modal } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import './ModalPersonel.scss'
import * as actions from "../../redux/actions";
import Select from 'react-select';
import { values } from 'lodash';
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
        checkedRepast: false,
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
                [event.target.name]: event.target.checked === true ? STATUS_REPORT_HR_ID.TANG_CA : STATUS_REPORT_HR_ID.DI_LAM, // Thêm hoặc cập nhật thuộc tính giá trị
            };
        }

        if (id === 'repastEId') {
            updatedItem = {
                ...item,
                [event.target.name]: event.target.checked === true ? 1 : 0, // Thêm hoặc cập nhật thuộc tính giá trị
            };
        }

        this.setState((prevState) => ({
            listUser: prevState.listUser.map((user) =>
                user.userId === updatedItem.userId ? updatedItem : user
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

    render() {
        let {
            listUser, checked,
            checkedRepast
        } = this.state

        // console.log(this.props.allPersonnelExtra)
        console.log('listUser', this.state.listUser)
        // console.log(this.props.allPersonnel)
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
                                    <th><span className='icon-checkbox-all' onClick={() => this.handleCheckedAll('checked')}>{checked ? <i className="far fa-check-square"></i> : <i className="far fa-square"></i>}</span> <span style={{ marginLeft: '5px' }}>Tăng ca</span></th>
                                    <th>Thời gian</th>
                                    <th><span className='icon-checkbox-all' onClick={() => this.handleCheckedAll('checkedRepast')}>{checkedRepast ? <i className="far fa-check-square"></i> : <i className="far fa-square"></i>}</span> <span style={{ marginLeft: '5px' }}>Ăn nhẹ</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {listUser && listUser.length > 0 &&
                                    listUser.map((item, index) => {
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
                                                                // id={item.id === userUpdate.id ? userUpdate.userId : item.userId}
                                                                name="statusId"
                                                                checked={item.statusId === STATUS_REPORT_HR_ID.TANG_CA}
                                                                // // value={0}
                                                                disabled={
                                                                    () => {
                                                                        let user = this.props.allPersonnel.filter(itemR => itemR.id = item.id)
                                                                        if (user) {
                                                                            if (user.statusId === STATUS_REPORT_HR_ID.TANG_CA) return true;
                                                                            return false;
                                                                        }
                                                                    }
                                                                }
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
                                                            className="form-control "
                                                            disabled={
                                                                () => {
                                                                    let user = this.props.allPersonnel.filter(itemR => itemR.id = item.id)
                                                                    if (user) {
                                                                        if (user.statusId === STATUS_REPORT_HR_ID.TANG_CA) return true;
                                                                        return false;
                                                                    }
                                                                }
                                                            }
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
                                                                disabled={
                                                                    () => {
                                                                        let user = this.props.allPersonnel.filter(itemR => itemR.id = item.id)
                                                                        if (user) {
                                                                            if (user.statusId === STATUS_REPORT_HR_ID.TANG_CA) return true;
                                                                            return false;
                                                                        }
                                                                    }
                                                                }
                                                                // value={1}
                                                                // onChange={(event) => this.handleCheckBox(event, !_.isEmpty(userUpdate) && item.id === userUpdate.id ? userUpdate : item)}
                                                                onChange={(event) => this.handleCheckBox(event, item, 'repastEId')}

                                                            />
                                                        </>
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
