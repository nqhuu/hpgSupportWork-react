import { Modal } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import './ModalHandleRequest.scss'


class ModalHandleRequest extends Component {

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
        this.props.toggle()
        this.setState({
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthDay: '',
            gender: 'M',
        })
    }

    handleOnchangeSelect = (e) => {
        this.setState({

        })
    }



    render() {
        console.log(this.props)
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
                        // onClick={this.handleCloseModal}
                        >
                            <i className="fa fa-times" aria-hidden="true">
                            </i></span>
                    </div>



                    <div className='modal-booking-body'>
                        <div className='row'>

                        </div>
                    </div>
                </div>

                <div className='modal-booking-footer'>
                    <button
                        className='btn-confirm'
                    // onClick={() => this.handleConfirmBooking()}
                    >
                        Xác nhận
                    </button>

                    <button
                        className='btn-close'
                    // onClick={() => this.handleCloseModal()}
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // patientBookAppointment: (data) => dispatch(actions.patientBookAppointment(data)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalHandleRequest);
