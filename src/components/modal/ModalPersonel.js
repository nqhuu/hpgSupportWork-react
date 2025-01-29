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




class ModalPersonel extends Component {

    state = {

    }

    async componentDidMount() {

    }


    async componentDidUpdate(prevProps, prevState, snapshot) {


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

    render() {
        let {

        } = this.state

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
                            <i className="fa fa-times" aria-hidden="true">
                            </i></span>
                    </div>

                    <div className='modal-hr-body '>

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
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalPersonel);
