import { Modal } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import './ModalAddDevice.scss'
import * as actions from "../../redux/actions";
import Select from 'react-select';
import { over, values } from 'lodash';
import { TYPE_DEVICE } from '../../ultil/constant';
import { uploadsFile } from '../../services/userService'
import handleUploadFile from "../../config/HandleUploadFile"
import { handleCreateRequest, updateRequestSupport } from "../../services/userService"
import _ from 'lodash'




class ModalAddDevice extends Component {

    state = {
        listTypeDevice: [],
        listLocation: [],
        listDepartment: [],
        deviceAdded: {},
        type: '',
    }

    async componentDidMount() {
        this.setState({
            deviceAdded: {
                type: '',
                deviceCode: '',
                deviceName: '',
                departmentId: '',
                userId: '',
                locationId: '',
                purchaseDate: '',
                maintenance: '',
                maintenancePeriod: '',
                serialNumber: '',
                handoverDate: '',
                warranty: '',
                image: '',
                information: '',
                mngDepartmentId: '',
            }
        })
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

        if (prevProps.allLocation !== this.props.allLocation) {
            try {
                let listLocation = await this.handleOptionSelect(this.props.allLocation, 'locationId', 'locationName');
                this.setState({ listLocation });
            } catch (error) {
                console.error("Lỗi khi load danh sách phòng ban:", error);
            }
        }

        if (prevProps.allDepartment !== this.props.allDepartment) {
            try {
                let listDepartment = await this.handleOptionSelect(this.props.allDepartment, 'departmentId', 'departmentName');
                this.setState({ listDepartment });
            } catch (error) {
                console.error("Lỗi khi load danh sách phòng ban:", error);
            }
        }
    }

    handleOptionSelect = async (prop, id, name) => {
        let list = []
        list = await prop?.map((item, index) => {
            let obj = {};
            obj.value = item[id];
            obj.label = item[name];
            return obj
        });
        return list
    }

    handleOnchangeInput = async (e, id) => {
        let copyState = { ...this.state.deviceAdded };
        let value = e.target.value
        copyState[id] = value;
        if (id === 'deviceCode') {
            let firstCode = await this.handleFirstDeviceCode(copyState.type.value)
            let valueCopy = value.toUpperCase();
            if (_.isEmpty(firstCode) || firstCode === '-') {
                toast.warning('Bạn cần chọn Chủng loại trước khi nhập mã')
                return;
            }
            // Nếu giá trị không bắt đầu bằng firstCode hoặc bị xóa, reset lại firstCode
            if (firstCode.length > valueCopy.length && valueCopy.length > 0) {
                valueCopy = firstCode;
            }

            // Nếu giá trị hiện tại không bắt đầu bằng firstCode -> tự động thêm lại và cộng thêm valueCopy (người dùng nhập)
            if (!valueCopy.startsWith(firstCode)) {
                valueCopy = firstCode + valueCopy;
            }

            this.setState(prevState => ({
                deviceAdded: { ...prevState.deviceAdded, [id]: valueCopy }
            }));
            return;
        }

        this.setState({
            deviceAdded: { ...copyState }
        })
    }

    handleCloseModal = () => {
        this.props.handleOpenOrCloseModal();
        this.setState({
            deviceAdded: {
                type: '',
                deviceCode: '',
                deviceName: '',
                departmentId: '',
                userId: '',
                locationId: '',
                purchaseDate: '',
                maintenance: '',
                maintenancePeriod: '',
                serialNumber: '',
                handoverDate: '',
                warranty: '',
                image: '',
                information: '',
                mngDepartmentId: '',
            }
        })
    }

    handleChangeSelect = (selectOptions, actionMeta) => {
        let selectCopy = { ...this.state.deviceAdded[actionMeta.name] }
        selectCopy.value = selectOptions.value;
        selectCopy.label = selectOptions.label;
        this.setState({
            ...this.state,
            deviceAdded: { ...this.state.deviceAdded, [actionMeta.name]: selectCopy },
        }, () => {
            let typeDevice = this.state.deviceAdded?.type?.value ? this.state.deviceAdded?.type?.value : '';
            let firstCode = this.handleFirstDeviceCode(typeDevice)
            this.setState({
                deviceAdded: { ...this.state.deviceAdded, deviceCode: firstCode }
            })
        })

    }

    handleFirstDeviceCode = (typeDevice) => {
        if (typeDevice) {
            let firstCode = Object.entries(TYPE_DEVICE).find(([key, device]) => key === typeDevice);
            return firstCode[1] + '-'
        }
        return '-'
    }

    render() {
        let { listTypeDevice, deviceAdded, listLocation, listDepartment } = this.state;
        // console.log(this.props.allSupport);
        // console.log(this.props.allDepartment);

        // console.log(this.state.listLocation);
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
                            Tạo mới thiết bị
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
                                <label htmlFor="typeDevice">Chủng loại (*)</label>
                                {/* <input className="form-control" id="typeDevice" type="text" /> */}
                                <Select
                                    className="modal-device-body-select"
                                    name="type"
                                    value={deviceAdded?.type || null}
                                    options={listTypeDevice}
                                    menuPortalTarget={document.body} // Đưa menu ra khỏi modal
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 1051 }) }} // Đảm bảo menu có z-index cao
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="form-group col-3">
                                <label htmlFor="deviceCode">Mã thiết bị</label>
                                <div className="input-group">
                                    {/* <span className="input-group-text">{firstCode}</span> */}
                                    <input
                                        type="text"
                                        value={deviceAdded?.deviceCode || null}
                                        className="form-control"
                                        id="deviceCode" placeholder="Mã Thiết bị"
                                        onChange={(e) => this.handleOnchangeInput(e, 'deviceCode')}
                                    />
                                </div>
                            </div>
                            <div className=" form-group col-6">
                                <label htmlFor="deviceName">Tên thiết bị</label>
                                <input className="form-control" id="deviceName" type="text"
                                    onChange={(e) => this.handleOnchangeInput(e, 'deviceName')}
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="departmentUsage">Bộ phận sử dụng</label>
                                <Select
                                    className="modal-device-body-select"
                                    name="departmentId"
                                    value={deviceAdded?.departmentId || null}
                                    options={listDepartment}
                                    menuPortalTarget={document.body} // Đưa menu ra khỏi modal
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 1051 }) }} // Đảm bảo menu có z-index cao
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="form-group col-3">
                                <label htmlFor="userUsage">Người sử dụng</label>
                                <input className="form-control" id="userUsage" type="text"
                                    onChange={(e) => this.handleOnchangeInput(e, 'userId')}
                                />
                            </div>
                            <div className="form-group col-3">
                                <label htmlFor="location">Vị trí lắp đặt</label>
                                <Select
                                    className="modal-device-body-select"
                                    name="locationId"
                                    value={deviceAdded?.locationId || null}
                                    options={listLocation}
                                    menuPortalTarget={document.body} // Đưa menu ra khỏi modal
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 1051 }) }} // Đảm bảo menu có z-index cao
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="handoverDate">Ngày bàn giao</label>
                                <input className="form-control" id="handoverDate" type="text"
                                    onChange={(e) => this.handleOnchangeInput(e, 'handoverDate')}

                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="maintenDate">Bảo trì ngày</label>
                                <input className="form-control" id="maintenDate" type="text"
                                    onChange={(e) => this.handleOnchangeInput(e, 'maintenance')}

                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="maintenTime">Lịch bảo trì</label>
                                <input className="form-control" id="maintenTime" type="text"
                                    onChange={(e) => this.handleOnchangeInput(e, 'maintenancePeriod')}
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="sn">S/N</label>
                                <input className="form-control" id="sn" type="text"
                                    onChange={(e) => this.handleOnchangeInput(e, 'serialNumber')}
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="purchaseDate">Ngày mua</label>
                                <input className="form-control" id="purchaseDate" type="text"
                                    onChange={(e) => this.handleOnchangeInput(e, 'purchaseDate')}
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="warranty">Hạn bảo hành</label>
                                <input className="form-control" id="warranty" type="text"
                                    onChange={(e) => this.handleOnchangeInput(e, 'warranty')}
                                />
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
                                <input className="form-control" id="infor" type="text"
                                    onChange={(e) => this.handleOnchangeInput(e, 'information')}
                                />
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
        allSupport: state.user.allSupport,
        allLocation: state.user.allLocation,
        allDepartment: state.user.allDepartment,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddDevice);
