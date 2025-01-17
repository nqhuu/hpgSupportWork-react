import { Modal } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import './ModalRequestSupport.scss'
import * as actions from "../../redux/actions";
import Select from 'react-select';
import { values } from 'lodash';
import { CODE, VALUE, DATA_TABLE } from '../../ultil/constant';
import { uploadsFile } from '../../services/userService'
import handleUploadFile from "../../config/HandleUploadFile"
import { handleCreateRequest } from "../../services/userService"



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
    }

    async componentDidMount() {
        this.props.getAllSupport()
        this.props.getAllLocation()
        this.props.getAllErrorCode()
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {

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
        this.props.toggle()
        this.setState({
            selectType: null,
            selectSoft: null,
            selectTypeDevice: null,
            selectLocation: null,
            selectTypeError: null,
            selectLevel: null,
        })
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

    handleOnchangeImg = (e) => {
        // console.log(e.target.files)
        this.setState({
            imgSelect: e.target.files[0]
        })
    }



    handleUploadFile = async () => {
        // console.log(this.state.imgSelect)
        let response = await handleUploadFile('imgerror', this.state.imgSelect)
        console.log('response', response)
        if (response) {
            if (response.errCode === 0) {
                toast.success(response.errMessage)
            }
            if (response.errCode === 1) {
                toast.error(response.errMessage)
            }
        }

    }


    handleCreateRequest = async () => {
        let data = {
            selectType: this.state.selectType,
            selectSoft: this.state.selectSoft,
            selectTypeDevice: this.state.selectTypeDevice,
            selectLocation: this.state.selectLocation,
            selectTypeErrorPc: this.state.selectTypeErrorPc,
            selectTypeErrorPm: this.state.selectTypeErrorPm,
            selectLevel: this.state.selectLevel,
        }
        let response = await handleCreateRequest(data)
        console.log(response)

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

        console.log(this.state)

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
                                <label className="form-label">Phân loại</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name="selectType"
                                    value={selectType || null}
                                    options={listType}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label">Chọn phần cứng/phần mềm</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name={selectType?.value === VALUE.PHAN_CUNG ? "selectTypeDevice" : "selectSoft"}
                                    value={selectType?.value === VALUE.PHAN_CUNG ? selectTypeDevice || null : selectSoft || null}
                                    options={selectType?.value === VALUE.PHAN_CUNG ? listTypeDevice : listSoft}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label" >Vị trí</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name="selectLocation"
                                    value={selectLocation || null}
                                    options={listLocation}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label" >Loại lỗi</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name={selectType?.value === VALUE.PHAN_CUNG ? "selectTypeErrorPc" : "selectTypeErrorPm"}
                                    value={selectType?.value === VALUE.PHAN_CUNG ? selectTypeErrorPc || null : selectTypeErrorPm || null}
                                    options={selectType?.value === VALUE.PHAN_CUNG ? listErrorPc : listErrorPm}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label" >Mức độ</label>
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
                    <button
                        type="button" className="btn btn-primary"
                        // onClick={() => this.handleUploadFile()}
                        onClick={() => this.handleCreateRequest()}
                    >
                        Xác nhận
                    </button>

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
        isLoggedIn: state.user.isLoggedIn,
        allSupport: state.user.allSupport,
        allLocation: state.user.allLocation,
        allErrorCode: state.user.allErrorCode
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllSupport: (data) => dispatch(actions.getAllSupport(data)),
        getAllLocation: () => dispatch(actions.getAllLocation()),
        getAllErrorCode: () => dispatch(actions.getAllErrorCode()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalHandleRequest);
