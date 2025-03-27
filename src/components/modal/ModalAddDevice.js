import { Modal } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import './ModalAddDevice.scss'
import * as actions from "../../redux/actions";
import Select from 'react-select';
import { over, values } from 'lodash';
import { TYPE_DEVICE, DATE_SELECT, ACTION } from '../../ultil/constant';
import handleUploadFile from "../../config/HandleUploadFile"
import _ from 'lodash'
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale"; // SỬ DỤNG ĐỂ CHUYỂN ĐỔI NGÔN NGỮ CỦA DatePicker
import moment from 'moment-timezone';
import { createDevices } from '../../services/managerService'




class ModalAddDevice extends Component {

    state = {
        listTypeDevice: [],
        listLocation: [],
        listDepartment: [],
        listUser: [],
        listUserInDp: [],
        listvendors: [],
        listStatus: [{ value: 'SD1', label: 'Đang sử sụng' }, { value: 'SD2', label: 'Lưu kho' },
        { value: 'SD3', label: 'Thanh lý' }, { value: 'SD4', label: 'Hỏng' }, { value: 'SD5', label: 'Đã xuất kho' }
        ],
        deviceAdded: {},
        deviceAdded: {
            id: null,
            type: '',
            deviceCode: '',
            deviceName: '',
            departmentId: null,
            userId: null,
            locationId: null,
            purchaseDate: '',
            maintenance: '',
            maintenancePeriod: '',
            serialNumber: '',
            handoverDate: '',
            warranty: '',
            image: '',
            information: '',
            vendorId: null,
            statusId: 'SD1',
            mngDepartmentId: null,
            importDate: '',
            exportDate: '',
        },
        isDisable: true,
    }

    async componentDidMount() {
        await this.props.getAllSupport();
        await this.props.getAllLocation();
        await this.props.getAllDepartmentRedux();
        await this.props.getAllUser();
        await this.props.getAllVendor();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.addDevice !== this.props.addDevice || prevProps.currentDevice !== this.props.currentDevice) {
            this.setState({
                isDisable: this.props.currentDevice ? true : !this.props.addDevice
            });
        }

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

        if (prevProps.allUser !== this.props.allUser) {
            try {
                let dataUser = await this.findUser(this.props.allUser)
                this.setState({
                    listUser: dataUser ? dataUser : [],
                    // allUser: this.props.allUser,
                })
            } catch (error) {
                console.error("Lỗi khi load danh sách phòng ban:", error);
            }
        }

        if (prevProps.allVendors !== this.props.allVendors) {
            try {
                let listvendors = await this.handleOptionSelect(this.props.allVendors, 'id', 'vendorName');
                this.setState({ listvendors });
            } catch (error) {
                console.error("Lỗi khi load danh sách NCC:", error);
            }
        }

        if (prevProps.currentDevice !== this.props.currentDevice) {
            let currentDevice = this.props.currentDevice;
            let fullname = (currentDevice?.userData?.firstName ? currentDevice?.userData?.firstName : '') + ' ' + (currentDevice?.userData?.lastName ? currentDevice?.userData?.lastName : '')
            this.setState({
                deviceAdded: {
                    id: currentDevice?.id || '',
                    type: { value: currentDevice?.typeDevice?.keyMap, label: currentDevice?.typeDevice?.value } || null,
                    deviceCode: currentDevice?.deviceCode || '',
                    deviceName: currentDevice?.deviceName || '',
                    vendorId: currentDevice?.vendorId || '',
                    departmentId: { value: currentDevice?.departmentData?.departmentId, label: currentDevice?.departmentData?.departmentName } || null,
                    userId: { value: currentDevice?.userData?.id, label: fullname } || null,
                    mngDepartmentId: { value: currentDevice?.mngDepartmentData?.departmentId, label: currentDevice?.mngDepartmentData?.departmentName } || null,
                    serialNumber: currentDevice?.serialNumber,
                    locationId: { value: currentDevice?.locationData?.locationId, label: currentDevice?.locationData?.locationName } || null,
                    purchaseDate: currentDevice?.purchaseDate || '',
                    maintenance: currentDevice?.maintenance || '',
                    maintenancePeriod: currentDevice?.maintenancePeriod || '',
                    handoverDate: currentDevice?.handoverDate || '',
                    exportDate: currentDevice?.exportDate || '',
                    importDate: currentDevice?.importDate || '',
                    warranty: currentDevice?.warranty || '',
                    image: currentDevice?.image || '',
                    information: currentDevice?.information || '',
                    statusId: { value: currentDevice?.statusDevice?.keyMap, label: currentDevice?.statusDevice?.value } || null,
                },
            })
        }
    }

    findUser = async (list) => {
        let dataUser = [];
        if (list) {
            dataUser = list.map((item, index) => {
                let user = {};
                user.value = item.id;
                user.label = `${item.firstName} ${item.lastName}`
                return user
            })
        }
        return dataUser;
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
            value = value.replace(/\s/g, ""); // không cho gõ khoảng trắng
            let firstCode = await this.handleFirstDeviceCode(copyState.type.value)
            let valueCopy = value.toUpperCase();
            // Chỉ cho phép chữ, số và dấu '-' (không có khoảng trắng)
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

        if (id === 'serialNumber') {
            const regex = /^[A-Z0-9_-]*$/i; // Cho phép nhập từng ký tự nhưng vẫn giới hạn ký tự hợp lệ

            if (!regex.test(value)) {
                toast.error("Serial Number không hợp lệ! Chỉ cho phép A-Z, 0-9, _ và -.");
                return;
            }
            if (value.length > 25) {
                toast.error("Serial Number quá dài! Giới hạn tối đa 25 ký tự.");
                return;
            }
            this.setState(prevState => ({
                deviceAdded: { ...prevState.deviceAdded, [id]: value }
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
            },
        })
    }

    handleChangeSelect = (selectOptions, actionMeta) => {
        let updatedDeviceAdded = {
            ...this.state.deviceAdded,
            [actionMeta.name]: {
                value: selectOptions.value,
                label: selectOptions.label,
            },
        };
        // console.log(actionMeta.name)
        // if (actionMeta.name === 'userId') {
        //     if (!this.state.deviceAdded.departmentId) {
        //         toast.error('bạn cần chọn bộ phận sử dụng trước');
        //         return;
        //     }
        // }

        this.setState({ deviceAdded: updatedDeviceAdded }, () => {
            //set cố định đầu mã của thiết bị
            if (actionMeta.name === 'type') {
                let typeDevice = this.state.deviceAdded?.type?.value ? this.state.deviceAdded?.type?.value : '';
                let firstCode = this.handleFirstDeviceCode(typeDevice)
                this.setState({
                    deviceAdded: { ...this.state.deviceAdded, deviceCode: firstCode }
                })
            }

            if (actionMeta.name === "departmentId") {

                // Kiểm tra dữ liệu trước khi lọc
                if (!Array.isArray(this.props.allUser) || this.props.allUser.length === 0) {
                    toast.error("Dữ liệu allUser không hợp lệ hoặc rỗng:", this.props.allUser);
                    return;
                }

                let departmentId = updatedDeviceAdded.departmentId?.value;

                let listUser = this.props.allUser.filter(
                    (item) => String(item.departmentId) === String(departmentId) // Ép kiểu để chắc chắn khớp
                );

                if (!listUser.length) {
                    console.log(selectOptions.label)
                    toast.warning(`Không tìm thấy người dùng nào cho phòng: ${selectOptions.label}`);
                    this.setState({ listUserInDp: [] });
                    return;
                }

                this.findUser(listUser)
                    .then((dataUser) => {
                        this.setState({ listUserInDp: dataUser || [] });
                    })
                    .catch((error) => console.error("Lỗi khi gọi findUser:", error));
            }
        });
    };

    handleFirstDeviceCode = (typeDevice) => {
        if (typeDevice) {
            let firstCode = Object.entries(TYPE_DEVICE).find(([key, device]) => key === typeDevice);
            return firstCode[1] + '-'
        }
        return '-'
    }

    handleDateChange = (date, id) => {
        let deviceAddedCopy = { ...this.state.deviceAdded };

        // Nếu không có ngày, gán giá trị rỗng và cập nhật state
        if (!date) {
            deviceAddedCopy[id] = "";
            this.setState({ deviceAdded: deviceAddedCopy });
            return;
        }

        let selectedDate = moment(date, "DD/MM/YYYY");
        if (!selectedDate.isValid()) { // hàm isValid là của thư viện moment
            toast.error("Ngày không hợp lệ!");
            return;
        }

        deviceAddedCopy[id] = selectedDate.format("DD/MM/YYYY");

        let purchaseMoment = moment(deviceAddedCopy.purchaseDate, "DD/MM/YYYY");
        let handoverMoment = moment(deviceAddedCopy.handoverDate, "DD/MM/YYYY");
        let maintenanceMoment = moment(deviceAddedCopy.maintenance, "DD/MM/YYYY");
        let maintenancePeriodMoment = moment(deviceAddedCopy.maintenancePeriod, "DD/MM/YYYY");
        let importDateMoment = moment(deviceAddedCopy.importDate, "DD/MM/YYYY");
        let exportDateMoment = moment(deviceAddedCopy.exportDate, "DD/MM/YYYY");

        // Kiểm tra các trường hợp ngày bàn giao, bảo trì, bảo dưỡng
        if ([DATE_SELECT.handoverDate, DATE_SELECT.maintenance, DATE_SELECT.maintenancePeriod, DATE_SELECT.importDate, DATE_SELECT.exportDate].includes(id) && !_.isEmpty(deviceAddedCopy.purchaseDate)) {
            if (selectedDate.isBefore(purchaseMoment, "day")) {
                toast.error("Ngày bàn giao/bảo trì/bảo dưỡng/nhập, xuất kho phải cùng hoặc sau ngày mua hàng");
                return;
            }
        }

        // Kiểm tra ngày mua hàng có trước ngày bàn giao, bảo trì, bảo dưỡng không, ngày nhập kho, ngày xuất kho
        if (id === DATE_SELECT.purchaseDate && date) {
            let purchaseMoment = moment(date, "DD/MM/YYYY"); // Chuyển ngày mua hàng về moment

            // Danh sách các ngày cần so sánh với ngày mua hàng
            let compareDates = [
                handoverMoment,
                maintenanceMoment,
                maintenancePeriodMoment,
                importDateMoment,
                exportDateMoment,
            ].filter(date => !_.isEmpty(date)) // Lọc bỏ các giá trị rỗng hoặc undefined
            // .map(date => moment(date, "DD/MM/YYYY")); // Chuyển tất cả về moment

            // Kiểm tra nếu có ít nhất một ngày trước ngày mua hàng
            if (compareDates.some(compareMoment => purchaseMoment.isAfter(compareMoment, "day"))) {
                toast.error("Ngày mua hàng phải cùng hoặc trước ngày bàn giao, bảo trì, bảo dưỡng, nhập, xuất kho");
                return;
            }
        }

        // Kiểm tra lịch bảo trì không được trước bảo trì hiện tại
        if (id === DATE_SELECT.maintenance && maintenancePeriodMoment.isValid() && selectedDate.isAfter(maintenancePeriodMoment, "day")) {
            toast.error("Lịch bảo trì phải sau ngày bảo trì hiện tại và phải là ngày trong tương lai");
            return;
        }

        // Kiểm tra lịch bảo trì không được là ngày quá khứ
        if (id === DATE_SELECT.maintenancePeriod) {
            let today = moment();
            if (maintenanceMoment.isValid() && selectedDate.isBefore(maintenanceMoment, "day")) {
                toast.error("Lịch bảo trì phải sau ngày bảo trì hiện tại và phải là ngày trong tương lai");
                return;
            }
            if (selectedDate.isBefore(today, "day")) {
                toast.error("Lịch bảo trì phải là ngày hiện tại hoặc tương lai");
                return;
            }
        }

        // Kiểm tra ngày xuất kho phải sau ngày nhập kho
        if (id === DATE_SELECT.exportDate && exportDateMoment.isValid() && selectedDate.isBefore(importDateMoment, "day")) {
            toast.error("Ngày xuất kho phải sau hoặc bằng ngày nhập kho");
            return;
        }
        if (id === DATE_SELECT.importDate && importDateMoment.isValid() && selectedDate.isAfter(exportDateMoment, "day")) {
            toast.error("Ngày xuất kho phải sau hoặc bằng ngày nhập kho");
            return;
        }

        // kiểm tra ngày bàn giao so với ngày xuất kho
        if (id === DATE_SELECT.handoverDate && handoverMoment.isValid() && (selectedDate.isBefore(importDateMoment, "day") || selectedDate.isBefore(exportDateMoment, "day"))) {
            toast.error("Ngày bàn giao phải sau ngày xuất, nhập kho");
            return;
        }
        if ([DATE_SELECT.exportDate, DATE_SELECT.importDate].includes(id) && !_.isEmpty(deviceAddedCopy.handoverDate)) {
            if (selectedDate.isAfter(handoverMoment, "day")) {
                toast.error("Ngày xuất, nhập kho phải cùng hoặc sau ngày bàn giao");
                return;
            }
        }

        this.setState({ deviceAdded: deviceAddedCopy });
    };

    handleValidate = (action) => {

        let {
            type, deviceCode, deviceName, vendorId, serialNumber, purchaseDate,
            importDate, exportDate,
            departmentId, userId, locationId,
            handoverDate, warranty, mngDepartmentId, statusId,
        } = this.state.deviceAdded;
        let obj = {};

        if (action === ACTION.CREATE) {
            obj = {
                type, deviceCode, deviceName, vendorId,
                serialNumber, purchaseDate, importDate, warranty, statusId,
            };
        }

        // if (this.props.addDevice) {
        //     obj = {
        //         type, deviceCode, deviceName, vendorId,
        //         serialNumber, purchaseDate, importDate, warranty, statusId,
        //     };
        // }

        if (action === ACTION.UPDATE) {
            obj = {
                type, deviceCode, deviceName, vendorId, departmentId, userId, locationId, purchaseDate,
                serialNumber, handoverDate, warranty, mngDepartmentId, statusId, importDate, exportDate,
            };
        }

        return Object.entries(obj).find(([key, value]) => {
            if (value === undefined || value === null) return [key, value];
            if (value === "") return [key, value];
            if (key === "warranty" && +value <= 0) return [key, value];//  Kiểm tra riêng warranty > 0
            if (typeof value === "object") {
                if (value instanceof File) return false; // kiểm tra xem value có phải là kiểu file hay không với từ khóa instanceof để Loại trừ File object 
                return Object.keys(value).length === 0 ? [key, value] : false; //trả về một mảng chứa tất cả các khóa (key) của đối tượng. sao đó check length
            }
            return false;
        }) || false; // Trả về `false` nếu không có lỗi
    };

    handleCreateDevice = async () => {
        // let dataSendDb = { ...this.state.deviceAdded }
        let isEmpty = this.handleValidate(ACTION.CREATE);
        if (Array.isArray(isEmpty)) {
            if (isEmpty[0] === 'type') { toast.error('Bạn cần nhập chủng loại'); return; }
            if (isEmpty[0] === 'deviceCode') { toast.error('Bạn cần nhập mã thiết bị'); return; }
            if (isEmpty[0] === 'deviceName') { toast.error('Bạn cần nhập tên thiết bị'); return; }
            if (isEmpty[0] === 'serialNumber') { toast.error('Bạn cần nhập serial Number'); return; }
            if (isEmpty[0] === 'vendorId') { toast.error('Bạn cần nhập nhà cung cấp'); return; }
            if (isEmpty[0] === 'serialNumber') { toast.error('Bạn cần nhập serial Number'); return; }
            if (isEmpty[0] === 'purchaseDate') { toast.error('Bạn cần nhập ngày mua thiết bị'); return; }
            if (isEmpty[0] === 'importDate') { toast.error('Bạn cần nhập ngày nhập kho'); return; }
            if (isEmpty[0] === 'warranty') { toast.error('Bạn cần nhập số tháng bảo hành'); return; }
            if (isEmpty[0] === 'statusId') { toast.error('Bạn cần nhập trạng thái của thiết bị'); return; }



            if (isEmpty[0] === 'departmentId') { toast.error('Bạn cần nhập bộ phận sủ dụng'); return; }
            if (isEmpty[0] === 'userId') { toast.error('Bạn cần nhập người sử dụng'); return; }
            if (isEmpty[0] === 'locationId') { toast.error('Bạn cần nhập vị trí đặt thiết bị'); return; }
            if (isEmpty[0] === 'handoverDate') { toast.error('Bạn cần nhập ngày bàn giao'); return; }
            if (isEmpty[0] === 'mngDepartmentId') { toast.error('Bạn cần Bộ phận chuyên trách'); return; }
            // if (isEmpty[0] === 'image') { toast.error('Bạn cần ghi nhận hình ảnh'); return; }
        }

        if (isEmpty) {
            toast.error('Bạn cần nhập đủ các trường có dấu (*)')
            return;
        }

        if (!isEmpty) {
            let data = {};
            if (this.state.deviceAdded.image) {
                let imgUpload = await this.handleUploadFile()
                if (imgUpload && imgUpload.errCode === 0) {
                    data.image = imgUpload.file.path
                } else {
                    data.image = null
                }
            }
            data.type = this.state.deviceAdded?.type?.value;
            data.statusId = this.state.deviceAdded?.statusId?.value;
            data.deviceCode = this.state.deviceAdded?.deviceCode;
            data.deviceName = this.state.deviceAdded?.deviceName;
            data.vendorId = this.state.deviceAdded?.vendorId.value;
            data.departmentId = this.state.deviceAdded?.departmentId.value;
            data.userId = this.state.deviceAdded?.userId?.value;
            data.locationId = this.state.deviceAdded?.locationId?.value;
            data.purchaseDate = this.state.deviceAdded?.purchaseDate;
            data.maintenance = this.state.deviceAdded?.maintenance;
            data.maintenancePeriod = this.state.deviceAdded?.maintenancePeriod;
            data.serialNumber = this.state.deviceAdded?.serialNumber;
            data.handoverDate = this.state.deviceAdded?.handoverDate;
            data.warranty = +this.state.deviceAdded?.warranty;
            data.information = this.state.deviceAdded?.information;
            data.mngDepartmentId = this.state.deviceAdded?.mngDepartmentId?.value;
            data.importDate = this.state.deviceAdded?.importDate;
            data.exportDate = this.state.deviceAdded?.exportDate;


            console.log('handleCreateDevice', data)
            let response = await createDevices(data);
            if (response) {
                if (response.errCode !== 0) toast.error(response.errMessenger)
            }
            console.log(response)

        }

    }

    handleOpenEdit = () => {
        this.setState({
            isDisable: false
        })
    }

    handleUploadFile = async () => {
        // console.log(this.state.imgSelect)
        let response = await handleUploadFile('imgDevice', this.state.deviceAdded.image)
        // console.log('response', response)
        // if (response) {
        //     if (response.errCode === 0) {
        //         toast.success(response.errMessage)
        //     }
        //     if (response.errCode === 1) {
        //         toast.error(response.errMessage)
        //     }
        // }
        if (response) return response
    }

    handleOnchangeImg = (e) => {
        // console.log(e.target.files)
        this.setState({
            deviceAdded: { ...this.state.deviceAdded, image: e.target.files[0] }
        });
    };


    render() {
        let { listTypeDevice, deviceAdded, listLocation, listDepartment, listUserInDp,
            listStatus, listvendors, listUser, isDisable } = this.state;
        const isEditing = !_.isEmpty(this.props.currentDevice) && !this.props.addDevice && isDisable;
        const mngDepartment = this.props.currentDevice?.mngDepartmentData?.departmentId === this.props.userInfo?.departmentId
        console.log(deviceAdded)
        // console.log(this.props.userInfo?.departmentId)
        // console.log(mngDepartment)
        return (
            <Modal
                isOpen={this.props.isOpenModal}
                backdrop={true}
                size='xl'
                className='Modal-device-container'
            >
                <div className='modal-device-header'>
                    <span className='content-header'>
                        {
                            !_.isEmpty(this.props.currentDevice)
                                ?
                                'Cập nhật thiết bị'
                                :
                                'Tạo mới thiết bị'
                        }
                    </span>
                    <span
                        className='btn-close'
                        onClick={() => this.handleCloseModal()}
                    >
                    </span>
                </div>
                <div className='modal-device-content'>

                    <div className='modal-device-body datepicker-container'>
                        <div className="form-group row">
                            <div className=" form-group col-3">
                                <label htmlFor="typeDevice">Chủng loại (*)</label>
                                <Select
                                    className="modal-device-body-select"
                                    name="type"
                                    value={deviceAdded?.type || null}
                                    options={listTypeDevice}
                                    isDisabled={isDisable}
                                    menuPortalTarget={document.body} // Đưa menu ra khỏi modal
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 1051 }) }} // Đảm bảo menu có z-index cao
                                    onChange={this.handleChangeSelect}
                                />

                            </div>
                            <div className="form-group col-3">
                                <label htmlFor="deviceCode">Mã thiết bị (*)</label>
                                <div className="input-group">
                                    {/* <span className="input-group-text">{firstCode}</span> */}
                                    <input
                                        type="text"
                                        disabled={isDisable}
                                        id="deviceCode"
                                        className="form-control"
                                        placeholder="Mã thiết bị..."
                                        value={deviceAdded?.deviceCode || ''}
                                        onChange={(e) => this.handleOnchangeInput(e, 'deviceCode')}
                                    />
                                </div>
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="deviceName">Tên thiết bị (*)</label>
                                <input
                                    className="form-control"
                                    disabled={isDisable}
                                    id="deviceName"
                                    type="text"
                                    placeholder="Nhập tên thiết bị, vật tư..."
                                    value={deviceAdded?.deviceName || ''}
                                    onChange={(e) => this.handleOnchangeInput(e, 'deviceName')}
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="vendorId">Nhà cung cấp (*)</label>
                                <Select
                                    className="modal-device-body-select"
                                    name="vendorId"
                                    value={deviceAdded?.vendorId || null}
                                    options={listvendors}
                                    isDisabled={isDisable}
                                    menuPortalTarget={document.body} // Đưa menu ra khỏi modal
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 1051 }) }} // Đảm bảo menu có z-index cao
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="sn">S/N</label>
                                <input
                                    className="form-control"
                                    id="sn"
                                    disabled={isDisable}
                                    value={deviceAdded?.serialNumber || ''}
                                    type="text"
                                    placeholder="Nhập serial number"
                                    onChange={(e) => this.handleOnchangeInput(e, 'serialNumber')}
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="purchaseDate">Ngày mua (*)</label>
                                <DatePicker
                                    id="purchaseDate"
                                    className="form-control modal-device-body-datePicker"
                                    selected={deviceAdded?.purchaseDate ? new Date(deviceAdded.purchaseDate) : null}
                                    // selected={deviceAdded?.purchaseDate ? moment(deviceAdded?.purchaseDate, "DD/MM/YYYY").toDate() : null}
                                    // onSelect={(date) => this.handleDateChange(date, 'purchaseDate')} //chọn ngày khi click chuôt
                                    disabled={isDisable} // Vô hiệu hóa DatePicker
                                    onChange={(date) => this.handleDateChange(date, 'purchaseDate')} //nhập tay hoặc click chuột
                                    dateFormat="dd/MM/yyyy"
                                    locale={vi} // Thiết lập tiếng Việt
                                    isClearable={deviceAdded?.purchaseDate} // Cho phép xóa ngày bằng dấu "x" - trong {} true thì hiển thị đấu x
                                    placeholderText="Chọn ngày..."
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="importDate">Ngày nhập kho (*)</label>
                                <DatePicker
                                    id="importDate"
                                    className="form-control modal-device-body-datePicker"
                                    selected={deviceAdded?.importDate ? new Date(deviceAdded.importDate) : null}
                                    // onSelect={(date) => this.handleDateChange(date, 'purchaseDate')} //chọn ngày khi click chuôt
                                    disabled={isDisable} // Vô hiệu hóa DatePicker
                                    onChange={(date) => this.handleDateChange(date, 'importDate')} //nhập tay hoặc click chuột
                                    dateFormat="dd/MM/yyyy"
                                    locale={vi} // Thiết lập tiếng Việt
                                    isClearable={deviceAdded?.importDate} // Cho phép xóa ngày bằng dấu "x" - trong {} true thì hiển thị đấu x
                                    placeholderText="Chọn ngày..."
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="exportDate">Ngày xuất kho (*)</label>
                                <DatePicker
                                    id="exportDate"
                                    className="form-control modal-device-body-datePicker"
                                    selected={deviceAdded.exportDate ? new Date(deviceAdded.exportDate) : null}
                                    // onSelect={(date) => this.handleDateChange(date, 'purchaseDate')} //chọn ngày khi click chuôt
                                    disabled={isDisable} // Vô hiệu hóa DatePicker
                                    onChange={(date) => this.handleDateChange(date, 'exportDate')} //nhập tay hoặc click chuột
                                    dateFormat="dd/MM/yyyy"
                                    locale={vi} // Thiết lập tiếng Việt
                                    isClearable={deviceAdded.exportDate} // Cho phép xóa ngày bằng dấu "x" - trong {} true thì hiển thị đấu x
                                    placeholderText="Chọn ngày..."
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="mngDepartmentId">Bộ phận chuyên trách (*)</label>
                                <Select
                                    className="modal-device-body-select"
                                    name="mngDepartmentId"
                                    value={deviceAdded?.mngDepartmentId || null}
                                    options={listDepartment}
                                    isDisabled={isDisable}
                                    placeholder="Select..."
                                    menuPortalTarget={document.body} // Đưa menu ra khỏi modal
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 1051 }) }} // Đảm bảo menu có z-index cao
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="departmentId">Bộ phận sử dụng (*)</label>
                                <Select
                                    className="modal-device-body-select"
                                    name="departmentId"
                                    value={deviceAdded?.departmentId || null}
                                    options={listDepartment}
                                    isDisabled={isDisable}
                                    placeholder="Select..."
                                    menuPortalTarget={document.body} // Đưa menu ra khỏi modal
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 1051 }) }} // Đảm bảo menu có z-index cao
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="form-group col-3">
                                <label htmlFor="userUsage">Người sử dụng (*)</label>
                                <Select
                                    className="modal-device-body-select"
                                    name="userId"
                                    value={deviceAdded?.userId || null}
                                    options={listUserInDp}
                                    placeholder="Select..."
                                    // options={listUserInDp.length > 0 ? listUserInDp : listUser}
                                    isDisabled={isDisable}
                                    menuPortalTarget={document.body} // Đưa menu ra khỏi modal
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 1051 }) }} // Đảm bảo menu có z-index cao
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="form-group col-3">
                                <label htmlFor="location">Vị trí (*)</label>
                                <Select
                                    className="modal-device-body-select"
                                    name="locationId"
                                    value={deviceAdded?.locationId || null}
                                    options={listLocation}
                                    isDisabled={isDisable}
                                    placeholder="Select..."
                                    menuPortalTarget={document.body} // Đưa menu ra khỏi modal
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 1051 }) }} // Đảm bảo menu có z-index cao
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="handoverDate">Ngày bàn giao (*)</label>
                                <DatePicker
                                    id="handoverDate"
                                    className="form-control modal-device-body-datePicker"
                                    selected={deviceAdded?.handoverDate ? new Date(deviceAdded.handoverDate) : null}
                                    disabled={isDisable} // Vô hiệu hóa DatePicker
                                    onChange={(date) => this.handleDateChange(date, 'handoverDate')} //nhập tay hoặc click chuột
                                    dateFormat="dd/MM/yyyy"
                                    locale={vi} // Thiết lập tiếng Việt
                                    isClearable={deviceAdded?.handoverDate}// Cho phép xóa ngày bằng dấu "x"
                                    placeholderText="Chọn ngày..."
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="maintenance">Bảo trì ngày</label>
                                <DatePicker
                                    id="maintenance"
                                    className="form-control modal-device-body-datePicker"
                                    selected={deviceAdded?.maintenance ? new Date(deviceAdded.maintenance) : null}
                                    disabled={isDisable} // Vô hiệu hóa DatePicker
                                    onChange={(date) => this.handleDateChange(date, 'maintenance')} //nhập tay hoặc click chuột
                                    dateFormat="dd/MM/yyyy"
                                    locale={vi} // Thiết lập tiếng Việt
                                    isClearable={deviceAdded?.maintenance} // Cho phép xóa ngày bằng dấu "x"
                                    placeholderText="Chọn ngày..."
                                />
                            </div>
                            <div className=" form-group col-3">
                                <label htmlFor="maintenancePeriod">Lịch bảo trì</label>
                                <DatePicker
                                    id="maintenancePeriod"
                                    className="form-control modal-device-body-datePicker"
                                    selected={deviceAdded?.maintenancePeriod ? new Date(deviceAdded.maintenancePeriod) : null}
                                    disabled={isDisable} // Vô hiệu hóa DatePicker
                                    onChange={(date) => this.handleDateChange(date, 'maintenancePeriod')} //nhập tay hoặc click chuột
                                    dateFormat="dd/MM/yyyy"
                                    locale={vi} // Thiết lập tiếng Việt
                                    isClearable={deviceAdded?.maintenancePeriod}// Cho phép xóa ngày bằng dấu "x"
                                    placeholderText="Chọn ngày..."
                                />
                            </div>
                            <div className="form-group col-3">
                                <label htmlFor="warranty">Hạn bảo hành (*)</label>
                                <div className="form-group">
                                    <div className="input-group custom-warranty-group">
                                        <div className="col-8">
                                            <input
                                                id="warranty"
                                                type="number"
                                                min="0"
                                                className="form-control"
                                                placeholder="Nhập số tháng..."
                                                value={deviceAdded.warranty ?? ""}
                                                disabled={isDisable}
                                                onChange={(e) => this.handleOnchangeInput(e, 'warranty')} />
                                        </div>
                                        <div className="col-4">
                                            <span className="input-group-text h-100">Tháng</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-3">
                                <label htmlFor="imageDevice">Hình ảnh (*)</label>
                                <input
                                    className="form-control"
                                    id="imageDevice"
                                    type="file"
                                    disabled={isDisable}
                                    onChange={(e) => this.handleOnchangeImg(e)}
                                />
                            </div>
                            <div className="form-group col-3">
                                <label htmlFor="location">Trạng thái</label>
                                <Select
                                    className="modal-device-body-select"
                                    name="statusId"
                                    placeholder="Chọn trạng thái..." // Thêm placeholder ở đây
                                    value={deviceAdded?.statusId || null}
                                    options={listStatus}
                                    isDisabled={isDisable}
                                    menuPortalTarget={document.body} // Đưa menu ra khỏi modal
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 1051 }) }} // Đảm bảo menu có z-index cao
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className=" form-group col-6">
                                <label htmlFor="infor">Thông tin khác</label>
                                <input
                                    className="form-control"
                                    value={deviceAdded?.information || ""}
                                    id="infor"
                                    type="text"
                                    disabled={isDisable}
                                    onChange={(e) => this.handleOnchangeInput(e, 'information')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='modal-device-footer'>
                    <button
                        type="button"
                        className={`btn btn-modal ${isEditing ? "btn-warning" : "btn-primary"}`}
                        onClick={isEditing ? this.handleOpenEdit : this.handleCreateDevice}
                    >
                        {isEditing ? "Sửa" : "Xác nhận"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary btn-modal"
                    // className={`btn btn-modal ${isEditing ? "btn-warning" : "btn-primary"}`}
                    // onClick={isEditing ? this.handleOpenEdit : this.handleCreateDevice}
                    >
                        {/* {isEditing ? "Sửa" : "Xác nhận"} */}
                        Bàn giao
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary btn-modal"
                    >
                        {/* {isEditing ? "Sửa" : "Xác nhận"} */}
                        Xuất kho
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger btn-modal"
                        onClick={this.handleCloseModal}
                    >
                        {isEditing ? "Đóng" : "Hủy"}
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
        allUser: state.user.allUser,
        allVendors: state.manager.allVendors,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllSupport: (data) => dispatch(actions.getAllSupport(data)),
        getAllLocation: () => dispatch(actions.getAllLocation()),
        getAllDepartmentRedux: () => dispatch(actions.getAllDepartmentRedux()),
        getAllUser: () => dispatch(actions.getAllUserRedux()),
        getAllVendor: () => dispatch(actions.getAllVendorRedux()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddDevice);
