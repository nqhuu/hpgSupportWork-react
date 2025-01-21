import { Modal } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import './ModalRequestSupport.scss'
import * as actions from "../../redux/actions";
import Select from 'react-select';
import { values } from 'lodash';
import { CODE, VALUE, DATA_TABLE, DEPARTMENT } from '../../ultil/constant';
import { uploadsFile } from '../../services/userService'
import handleUploadFile from "../../config/HandleUploadFile"
import { handleCreateRequest, updateRequestSupport } from "../../services/userService"
import _ from 'lodash'




class ModalHandleRequest extends Component {

    state = {
        selectType: null,
        listType: [],
        selectSoft: null,
        listSoft: [],
        selectTypeDevice: null,
        listTypeDevice: [],
        selectLocation: null,
        listLocation: [],
        selectTypeErrorPc: null,
        listErrorPc: [],
        selectTypeErrorPm: null,
        listErrorPm: [],
        selectLevel: null,
        listLevel: [],
        note: '',
        imgSelect: '',
        requestId: '',
    }

    async componentDidMount() {
        // this.props.getAllSupport()
        // this.props.getAllLocation()
        // this.props.getAllErrorCode()
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.data !== this.props.data) {
            let selectErr = {}
            if (this.props.data && this.props.data.typeId === VALUE.PHAN_CUNG) {

                selectErr.selectTypeDevice = {
                    value: this.props.data?.softDiviceData?.keyMap || '',
                    label: this.props.data?.softDiviceData?.value || ''
                };
                selectErr.selectTypeErrorPc = {
                    value: this.props.data?.errorData?.errorId || '',
                    label: this.props.data?.errorData?.errorName || ''
                }
            }

            if (this.props.data && this.props.data.typeId === VALUE.PHAN_MEM) {
                selectErr.selectSoft = {
                    value: this.props.data?.softDiviceData?.keyMap || '',
                    label: this.props.data?.softDiviceData?.value || ''
                };

                selectErr.selectTypeErrorPm = {
                    value: this.props.data?.errorData?.errorId || '',
                    label: this.props.data?.errorData?.errorName || ''
                }
            }


            this.setState({
                selectType: {
                    value: this.props.data?.errorData?.typeError?.keyMap || '',
                    label: this.props.data?.errorData?.typeError?.value || ''
                },

                selectLocation: {
                    value: this.props.data?.locationRequetData?.locationId || '',
                    label: this.props.data?.locationRequetData?.locationName || ''
                },

                selectLevel: {
                    value: this.props.data?.priorityData?.keyMap || '',
                    label: this.props.data?.priorityData?.value || ''
                },
                note: this.props.data?.note || '',

                requestId: this.props.data?.requestId,
                ...selectErr

            })

        }


        if (prevProps.allSupport !== this.props.allSupport) {
            let listType = this.props.allSupport?.listType.map((item, index) => {
                let obj = {};
                obj.value = item.keyMap;
                obj.label = item.value;
                return obj
            });

            let listSoft = this.props.allSupport?.listSotfware.map((item, index) => {
                let obj = {};
                obj.value = item.keyMap;
                obj.label = item.value;
                return obj
            });

            let listTypeDevice = this.props.allSupport?.listTypeDevice.map((item, index) => {
                let obj = {};
                obj.value = item.keyMap;
                obj.label = item.value;
                return obj
            });

            let listLevel = this.props.allSupport?.listPriority.map((item, index) => {
                let obj = {};
                obj.value = item.keyMap;
                obj.label = item.value;
                return obj
            });

            let stateCopy = { ...this.state }
            stateCopy.listType = listType;
            stateCopy.listSoft = listSoft;
            stateCopy.listTypeDevice = listTypeDevice;
            stateCopy.listLevel = listLevel;
            if (stateCopy) {
                this.setState({
                    ...stateCopy
                })
            }

        }

        if (prevProps.allLocation !== this.props.allLocation) {

            let listLocation = this.props.allLocation?.map((item, index) => {
                let obj = {};
                obj.value = item.locationId;
                obj.label = item.locationName;
                return obj
            });
            let stateCopy = { ...this.state.listLocation }

            stateCopy.listLocation = listLocation;

            if (stateCopy) {
                this.setState({
                    ...stateCopy
                })
            }
        }


        if (prevProps.allErrorCode !== this.props.allErrorCode) {

            let listError = this.props.allErrorCode?.map((item, index) => {
                let obj = {};
                obj.value = item.errorId;
                obj.label = item.errorName;
                return obj
            });

            let listErrorPc = [];
            let listErrorPm = [];
            if (listError) {
                listErrorPc = listError.filter(item => item.value.startsWith(`${CODE.ERROR_PC}`));
                listErrorPm = listError.filter(item => item.value.startsWith(`${CODE.ERROR_PM}`));
            }
            let stateCopy = { ...this.state }
            stateCopy.listErrorPc = listErrorPc;
            stateCopy.listErrorPm = listErrorPm;

            if (stateCopy) {
                this.setState({
                    ...stateCopy
                })
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
        this.props.handleCloseModal()
        this.setState({
            selectType: null,
            selectSoft: null,
            selectTypeDevice: null,
            selectLocation: null,
            selectTypeError: null,
            selectLevel: null,
            selectTypeErrorPc: null,
            selectTypeErrorPm: null,

        })
    }


    handleChangeSelect = (selectOptions, actionMeta) => {
        let selectCopy = { ...this.state[actionMeta.name] }
        selectCopy.value = selectOptions.value;
        selectCopy.label = selectOptions.label;
        this.setState({
            ...this.state,
            [actionMeta.name]: selectCopy
        }, () => {
            if (this.state.selectType && this.state.selectType.value === VALUE.PHAN_CUNG) {
                console.log(this.state.selectType?.value)

                this.setState({
                    selectSoft: null,
                    selectTypeErrorPm: null,
                })
            }
            if (this.state.selectType && this.state.selectType.value === VALUE.PHAN_MEM) {
                this.setState({
                    selectTypeDevice: null,
                    selectTypeErrorPc: null,
                })
            }
        })
    }

    handleOnchangeImg = (e) => {
        // console.log(e.target.files)
        this.setState({
            imgSelect: e.target.files[0]
        })
    }



    handleUploadFile = async () => {
        // console.log(this.state.imgSelect)
        let response = await handleUploadFile('imgerror', this.state.imgSelect)
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

    handleValidate = () => {
        let {
            selectType, selectSoft, selectTypeDevice, selectLocation,
            selectTypeErrorPc, selectTypeErrorPm, selectLevel
        } = this.state
        let arrayCheck = [
            selectType, selectSoft, selectTypeDevice, selectLocation,
            selectTypeErrorPc, selectTypeErrorPm, selectLevel]

        let isEmpty = false;
        if (selectType && selectType.value === VALUE.PHAN_CUNG) {
            let newArray = [...arrayCheck]

            const index = newArray.indexOf(selectSoft);
            if (index !== -1) newArray.splice(index, 1);

            const index2 = newArray.indexOf(selectTypeErrorPm);
            if (index2 !== -1) newArray.splice(index2, 1);

            isEmpty = newArray.some(item => _.isEmpty(item))
        } else if (selectType && selectType.value === VALUE.PHAN_MEM) {
            let newArray = [...arrayCheck]

            const index = newArray.indexOf(selectTypeErrorPc);
            if (index !== -1) newArray.splice(index, 1);

            const index2 = newArray.indexOf(selectTypeDevice);
            if (index2 !== -1) newArray.splice(index2, 1);

            isEmpty = newArray.some(item => _.isEmpty(item))
        } else {
            isEmpty = true
            console.log('isEmpty3', isEmpty)
        }

        return (isEmpty)
    }

    handleCreateRequestUi = async () => {
        let {
            selectType, selectSoft, selectTypeDevice, selectLocation,
            selectTypeErrorPc, selectTypeErrorPm, selectLevel,
        } = this.state


        let isEmpty = this.handleValidate()

        if (isEmpty) {
            toast.warning("Bạn cần nhâp đủ các trường có dấu *")
            return;
        }

        let data = {};
        if (this.state.imgSelect) {
            let imgUpload = await this.handleUploadFile()
            if (imgUpload && imgUpload.errCode === 0) {
                console.log(imgUpload.file.path)
                data.img = imgUpload.file.path
            } else {
                data.img = null
            }
        }
        data.selectType = selectType;
        data.selectSoft = selectSoft;
        data.selectTypeDevice = selectTypeDevice;
        data.selectLocation = selectLocation;
        data.selectTypeErrorPc = selectTypeErrorPc;
        data.selectTypeErrorPm = selectTypeErrorPm;
        data.selectLevel = selectLevel;
        data.userId = this.props.userInfo.id;
        data.mngDepartmentId = this.props.departmentId;
        data.note = this.state.note;

        let response = await handleCreateRequest(data)

        if (response && response.errCode === 0) {
            toast.success(response.errMessage);
            this.props.getRequestSupport();
            this.handleCloseModal()
        }
        if (response && response.errCode === 1) {
            toast.warning(response.errMessage);
        }
        if (response && response.errCode === 2 || response.errCode === -1) {
            toast.error(response.errMessage);
        }
    }



    handleEditRequest = async () => {
        let {
            selectType, selectSoft, selectTypeDevice, selectLocation,
            selectTypeErrorPc, selectTypeErrorPm, selectLevel, requestId, imgSelect
        } = this.state

        let isEmpty = this.handleValidate()

        if (isEmpty) {
            toast.warning("Bạn cần nhâp đủ các trường có dấu *")
            return;
        }

        let data = {};
        if (this.state.imgSelect) {
            let imgUpload = await this.handleUploadFile()
            if (imgUpload && imgUpload.errCode === 0) {
                console.log(imgUpload.file.path)
                data.img = imgUpload.file.path
            } else {
                data.img = null
            }
        }
        data.selectType = selectType;

        if (selectSoft) data.softOrDiviceId = selectSoft;

        if (selectTypeDevice) data.softOrDiviceId = selectTypeDevice;

        if (selectTypeErrorPc) data.errorId = selectTypeErrorPc;

        if (selectTypeErrorPm) data.errorId = selectTypeErrorPm;

        data.selectLocation = selectLocation;
        data.selectLevel = selectLevel;
        data.userId = this.props.userInfo.id;
        data.note = this.state.note;
        data.requestId = requestId;
        data.img = imgSelect;
        data.handleEditRequest = VALUE.SEND_REQUEST

        let response = await updateRequestSupport(data)

        if (response && response.errCode === 0) {
            toast.success(response.errMessage);
            this.props.getRequestSupport();
            this.handleCloseModal()
        }
        if (response && response.errCode === 1) {
            toast.warning(response.errMessage);
        }

        if (response && response.errCode === -1) {
            toast.error(response.errMessage);
        }
    }

    render() {
        let {
            selectType,
            selectSoft,
            selectTypeDevice,
            selectLocation,
            selectTypeErrorPc,
            selectTypeErrorPm,
            selectLevel,
            listType,
            listSoft,
            listTypeDevice,
            listLocation,
            listErrorPc,
            listErrorPm,
            listLevel,
        } = this.state

        return (
            <Modal
                isOpen={this.props.isOpenModal}
                backdrop={true}
                size='xl'
                className='Modal-booking-container'
            >
                <div className='modal-booking-content'>
                    <div className='modal-booking-header'>
                        <span className='content-header'>
                            IT Support
                        </span>
                        <span
                            className='btn-close'
                            onClick={() => this.handleCloseModal()}
                        >
                            <i className="fa fa-times" aria-hidden="true">
                            </i></span>
                    </div>


                    <div className='modal-booking-body '>
                        <form className="row">
                            <div className="mb-3 form-group col-3">
                                <label className="form-label">Phân loại (*)</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name="selectType"
                                    value={selectType || null}
                                    options={listType}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label">Chọn phần cứng/phần mềm (*)</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name={selectType?.value === VALUE.PHAN_CUNG ? "selectTypeDevice" : "selectSoft"}
                                    value={selectType?.value === VALUE.PHAN_CUNG ? selectTypeDevice || null : selectSoft || null}
                                    options={selectType?.value === VALUE.PHAN_CUNG ? listTypeDevice : listSoft}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label" >Vị trí (*)</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name="selectLocation"
                                    value={selectLocation || null}
                                    options={listLocation}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label" >Loại lỗi (*)</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name={selectType?.value === VALUE.PHAN_CUNG ? "selectTypeErrorPc" : "selectTypeErrorPm"}
                                    value={selectType?.value === VALUE.PHAN_CUNG ? selectTypeErrorPc || null : selectTypeErrorPm || null}
                                    options={selectType?.value === VALUE.PHAN_CUNG ? listErrorPc : listErrorPm}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label" >Mức độ (*)</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name='selectLevel'
                                    value={selectLevel || null}
                                    options={listLevel}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="mb-3 form-group col-9" >
                                <label className="form-label" >Ghi chú</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.note}
                                    onChange={(e) => this.handleOnchangeInput(e, "note")}
                                />
                            </div>
                            <div className="input-group mb-3 col-3 " >
                                <input
                                    type="file"
                                    className="form-control"
                                    id="inputGroupFile02"
                                    onChange={(e) => this.handleOnchangeImg(e)}
                                />
                                <label className="input-group-text" htmlFor="inputGroupFile02"></label>
                            </div>

                        </form>
                    </div>
                </div>

                <div className='modal-booking-footer'>
                    {this.props && !_.isEmpty(this.props.data) ?
                        <button
                            type="button" className="btn btn-primary"
                            onClick={() => this.handleEditRequest()}
                        >
                            Sửa
                        </button>
                        :
                        <button
                            type="button" className="btn btn-primary"
                            onClick={() => this.handleCreateRequestUi()}
                        >
                            Xác nhận
                        </button>
                    }
                    <button
                        type="button" className="btn btn-danger"
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
        allSupport: state.user.allSupport,
        allLocation: state.user.allLocation,
        allErrorCode: state.user.allErrorCode
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalHandleRequest);
