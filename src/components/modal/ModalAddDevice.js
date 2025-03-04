import { Modal } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import './ModalAddDevice.scss'
import * as actions from "../../redux/actions";
import Select from 'react-select';
import { over, values } from 'lodash';
import { STATUS_USER_TYPE_EXTRA, STATUS_REPORT_HR, STATUS_REPORT_HR_ID, } from '../../ultil/constant';
import { uploadsFile } from '../../services/userService'
import handleUploadFile from "../../config/HandleUploadFile"
import { handleCreateRequest, updateRequestSupport } from "../../services/userService"
import _ from 'lodash'




class ModalAddDevice extends Component {

    state = {
        listTypeDevice: [],
        selectType: ''
    }

    async componentDidMount() {

    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allSupport !== this.props.allSupport) {
            if (this.props.allSupport && this.props.allSupport.listTypeDevice && this.props.allSupport.listTypeDevice.length > 0) {
                let list = this.props.allSupport?.listTypeDevice;
                let listType = list && list.length > 0 ? list.map((item, index) => {
                    let option = {};
                    option.value = item.keyMap;
                    option.label = item.value;
                    return option
                }) : [];

                this.setState({
                    listTypeDevice: listType
                });
            }
        }
    }

    handleOnchangeInput = (e, id) => {
        let copyState = { ...this.state };
        copyState[id] = e.target.value;
        this.setState({
            ...copyState
        })
    }

    handleCloseModal = () => {
        this.props.handleOpenOrCloseModal();
    }

    handleChangeSelect = (selectOptions, actionMeta) => {
        let selectCopy = { ...this.state[actionMeta.name] }
        selectCopy.value = selectOptions.value;
        selectCopy.label = selectOptions.label;
        this.setState({
            ...this.state,
            [actionMeta.name]: selectCopy
        })
    }


    render() {
        let { listTypeDevice, selectType } = this.state;
        console.log(this.state);
        return (
            <Modal
                isOpen={this.props.isOpenModal}
                backdrop={true}
                size='xl'
                className='Modal-device-container'
            >
                <div className='modal-device-content'>
                    <div className='modal-device-header'>
                        <span className='content-header'>
                            Báo tăng ca
                        </span>
                        <span
                            className='btn-close'
                            onClick={() => this.handleCloseModal()}
                        >
                        </span>
                    </div>

                    <div className='modal-device-body '>
                        <div className="form-group row">
                            <div className=" form-group col-3">
                                <label htmlFor="typeDevice">Chủng loại</label>
                                {/* <input className="form-control" id="typeDevice" type="text" /> */}
                                <Select
                                    name="selectType"
                                    value={selectType || null}
                                    options={listTypeDevice}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="deviceCode">Mã thiết bị</label>
                                <input className="form-control" id="deviceCode" type="text" />
                            </div>
                            <div className=" form-group col-6">
                                <label htmlFor="deviceName">Tên thiết bị</label>
                                <input className="form-control" id="deviceName" type="text" />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="departmentUsage">Bộ phận sử dụng</label>
                                <input className="form-control" id="departmentUsage" type="text" />
                            </div>
                            <div className="form-group col-3">
                                <label htmlFor="userUsage">Người sử dụng</label>
                                <input className="form-control" id="userUsage" type="text" />
                            </div>
                            <div className="form-group col-3">
                                <label htmlFor="location">Vị trí lắp đặt</label>
                                <input className="form-control" id="location" type="text" />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="handoverDate">Ngày bàn giao</label>
                                <input className="form-control" id="handoverDate" type="text" />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="maintenDate">Bảo trì ngày</label>
                                <input className="form-control" id="maintenDate" type="text" />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="maintenTime">Lịch bảo trì</label>
                                <input className="form-control" id="maintenTime" type="text" />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="sn">S/N</label>
                                <input className="form-control" id="sn" type="text" />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="purchaseDate">Ngày mua</label>
                                <input className="form-control" id="purchaseDate" type="text" />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="warranty">Hạn bảo hành</label>
                                <input className="form-control" id="warranty" type="text" />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="imageDevice">Hình ảnh</label>
                                <input
                                    className="form-control"
                                    id="imageDevice"
                                    type="file"
                                />
                            </div>
                            <div className=" form-group col-6">
                                <label htmlFor="infor">Thông tin khác</label>
                                <input className="form-control" id="infor" type="text" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='modal-device-footer'>
                    <button
                        type="button" className="btn btn-primary btn-modal"
                    // onClick={() => this.handleOvertimeReportModal()}
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
        allSupport: state.user.allSupport
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddDevice);
