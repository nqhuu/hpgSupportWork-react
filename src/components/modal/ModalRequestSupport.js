import { Modal } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import './ModalRequestSupport.scss'
import * as actions from "../../redux/actions";
import Select from 'react-select';
import { values } from 'lodash';




class ModalHandleRequest extends Component {

    state = {
        selectType: {
            // value: 'PC',
            // label: 'Phần cứng'
        },
        listType: [],
        selectSoft: {},
        listSoft: [],
        selectTypeDevice: {},
        listTypeDevice: [],
        selectLocation: {},
        listLocation: [],
        selectTypeError: {},
        listError: [],
        selectLevel: {},
        listLevel: [],
    }

    async componentDidMount() {
        this.props.getAllSupport()
        this.props.getAllLocation()
        this.props.getAllErrorCode()
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.allSupport !== this.props.allSupport) {
            let listType = this.props.allSupport.listType.map((item, index) => {
                let obj = {};
                obj.value = item.keyMap;
                obj.label = item.value;
                return obj
            });

            let listSoft = this.props.allSupport.listSotfware.map((item, index) => {
                let obj = {};
                obj.value = item.keyMap;
                obj.label = item.value;
                return obj
            });

            let listTypeDevice = this.props.allSupport.listTypeDevice.map((item, index) => {
                let obj = {};
                obj.value = item.keyMap;
                obj.label = item.value;
                return obj
            });

            let listLocation = this.props.allLocation.map((item, index) => {
                let obj = {};
                obj.value = item.locationId;
                obj.label = item.locationName;
                return obj
            });

            let listError = this.props.allErrorCode.map((item, index) => {
                let obj = {};
                obj.value = item.errorId;
                obj.label = item.errorName;
                return obj
            });

            let listLevel = this.props.allSupport.listPriority.map((item, index) => {
                let obj = {};
                obj.value = item.keyMap;
                obj.label = item.value;
                return obj
            });


            let stateCopy = { ...this.state }
            stateCopy.listType = listType;
            stateCopy.listSoft = listSoft;
            stateCopy.listTypeDevice = listTypeDevice;
            stateCopy.listLocation = listLocation;
            stateCopy.listError = listError;
            stateCopy.listLevel = listLevel;

            if (stateCopy) {
                this.setState({
                    ...this.state,
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
            fullName: '',
            phoneNumber: '',

        })
    }

    handleOnchangeSelect = (e) => {
        this.setState({

        })
    }


    handleChange = (selectOptions, actionMeta) => {
        let selectCopy = { ...this.state[actionMeta.name] }
        selectCopy.value = selectOptions.value;
        selectCopy.label = selectOptions.label;
        this.setState({
            ...this.state,
            [actionMeta.name]: selectCopy
        })
    }

    render() {
        let {
            selectType,
            selectSoft,
            selectTypeDevice,
            selectLocation,
            selectTypeError,
            selectLevel,
            listType,
            listSoft,
            listTypeDevice,
            listLocation,
            listError,
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
                                    value={selectType}
                                    options={listType}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label">Chọn phần cứng/phần mềm</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name={selectType.value === 'PC' ? "selectTypeDevice" : "selectSoft"}
                                    value={selectType.value === 'PC' ? selectTypeDevice : selectSoft}
                                    options={selectType.value === 'PC' ? listTypeDevice : listSoft}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label" >Vị trí</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name="selectLocation"
                                    value={selectLocation}
                                    options={listLocation}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label" >Loại lỗi</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name="selectTypeError"
                                    value={selectTypeError}
                                    options={listError}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="mb-3 form-group col-3">
                                <label className="form-label" >Mức độ</label>
                                {/* <input type="text" className="form-control" id="" /> */}
                                <Select
                                    name='selectLevel'
                                    value={selectLevel}
                                    options={listLevel}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="mb-3 form-group col-9">
                                <label className="form-label" >Ghi chú</label>
                                <input type="text" className="form-control" id="" />
                            </div>
                            <div className="input-group mb-3 col-3">
                                <input type="file" className="form-control" id="inputGroupFile02" />
                                <label className="input-group-text" htmlFor="inputGroupFile02"></label>
                            </div>

                        </form>
                    </div>
                </div>

                <div className='modal-booking-footer'>
                    <button
                        type="button" className="btn btn-primary"
                    // onClick={() => this.handleConfirmBooking()}
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
