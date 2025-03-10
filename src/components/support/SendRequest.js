import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import './SendRequest.scss'
import * as actions from "../../redux/actions";
import { VALUE, CODE, DEPARTMENT } from '../../ultil/constant';
import { handleDataRequestSupport, getAllUser, updateRequestSupport } from '../../services/userService'
// import Select from 'react-select';
// import _ from 'lodash'
import HomeFooter from '../../containers/HomePage/HomeFooter'
import HomeHeader from '../../containers/HomePage/HomeHeader';
import ModalRequestSupport from '../modal/ModalRequestSupport'
import moment from 'moment'
import { toast } from 'react-toastify';

class SendRequest extends Component {

    state = {
        showHandle: false,

        showHide: false,
        reqSupport: [],
        currentPage: 0,
        totalPages: 0,
        // isDeparment: VALUE.NOT_YET_COMPLETE_IT,
        isDeparment: '',
        selectRequestId: '',
        selectedOption: {},
        ListUserRep: [],
        listUser: [],
        isOpenModal: false,
        note: '',
        dataEdit: {},
    }

    componentDidMount = async () => {
        if (this.props?.department) {
            this.setState({
                isDeparment: this.props.department
            }, async () => await this.getRequestSupport())
        }

        await this.getAllUser();
        await this.props.getAllSupport()
        await this.props.getAllLocation()
        await this.props.getAllErrorCode()

    }


    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        //check khi có thay đổi department trong prop thì thực hiện gọi lại requestSupport
        if (prevProps.department !== this.props.department) {
            await this.setState({
                isDeparment: this.props.department,
                currentPage: 0, // Reset lại trang nếu cần
            });
            await this.getRequestSupport();
        }

        if (this.state.isDeparment === VALUE.NOT_YET_COMPLETE_IT) {
            if (prevProps.reqSupportIt !== this.props.reqSupportIt) {
                let data = this.props.reqSupportIt
                this.setState({
                    reqSupport: data.rows,
                    totalPages: data.totalPages,
                })
            }
        } else if (prevProps.reqSupportCd !== this.props.reqSupportCd) {
            let data = this.props.reqSupportCd
            console.log('CD', data)

            this.setState({
                reqSupport: data.rows,
                totalPages: data.totalPages,
            })
        }
    }

    getAllUser = async () => {
        if (this.state.reqSupport && this.state.reqSupport.length > 0) {
            let listUser = await getAllUser('', this.state.reqSupport[0].mngDepartmentId)
            if (listUser && listUser.errCode === 0) {
                let ListUserRep = listUser.data.map((item, index) => {
                    let select = {};
                    select.value = item.id;
                    select.label = `${item.firstName} ${item.lastName}`
                    return select
                })
                let selectedOption = {}
                selectedOption.value = listUser.data[0].id
                selectedOption.label = `${listUser.data[0].firstName} ${listUser.data[0].lastName}`

                let stateCopy = { ...this.state };
                stateCopy.listUser = listUser.data;
                stateCopy.ListUserRep = ListUserRep;
                stateCopy.selectedOption = selectedOption
                this.setState({
                    ...stateCopy
                })
            }
        }
    }

    getRequestSupport = async () => {
        let response = await handleDataRequestSupport(this.state.isDeparment, this.state.currentPage, VALUE.LIMIT_HANDLE, this.props.userInfo.id)
        if (response && response.errCode === 0) {
            let data = response.data
            data.isDeparment = this.state.isDeparment
            await this.props.handleDataHomeRedux(data)
        }
    }

    // Xử lý khi chuyển trang
    handlePageClick = async (event) => {
        const newOffset = (event.selected);
        this.setState({
            currentPage: newOffset
        }, () => this.getRequestSupport(this.state.isDeparment, this.state.currentPage, this.state.limit))
    };

    handleEditProcessing = async (item, id) => {
        if (!item) {
            console.error('Item is undefined or null:', item);
            return;
        }

        this.setState({
            isOpenModal: true,
            dataEdit: {
                id: item.id,
                userId: item.id,
                errorData: item.errorData,
                locationRequetData: item.locationRequetData,
                mngDepartmentId: item.mngDepartmentId,
                note: item.note,
                priorityData: item.priorityData,
                softDiviceData: item.softDiviceData,
                statusId: item.statusId,
                typeId: item.typeId,
                userRequestData: item.userRequestData,
                requestId: id
            },
        })

    }

    closeHandleProcessing = async (item, id) => {
        this.setState({
            selectRequestId: '',
        })
    }

    handleChange = async (selectedOption) => {
        console.log(selectedOption)
        this.setState({
            selectedOption: selectedOption
        })
    }

    handleCancelRequest = async (item) => {
        if (window.confirm("bạn có thực sự muốn xóa yêu cầu này")) {
            let response = await updateRequestSupport({
                requestId: item.id,
                handleCancelRequest: VALUE.CANCEL
            })

            if (response && response.errCode === 0) {
                if (response && response.errCode === 0) {
                    toast.success(response.errMessage);
                    this.getRequestSupport();
                }
            }
        }

    }

    handleOpenModal = async () => {
        this.setState({
            isOpenModal: true
        })
    }

    handleCloseModal = () => {
        this.setState({
            isOpenModal: false,
            dataEdit: {}
        })
    }

    render() {
        let { reqSupport, currentPage } = this.state
        let stt = currentPage * VALUE.LIMIT_HANDLE + 1
        return (
            <div className='send-request-container'>
                <div className='header-home'>
                    <HomeHeader />
                </div>
                <div className='send-create-support-container'>
                    <div className='send-support-header'>
                        <h2 className='send-support-text'>{this.state?.isDeparment === VALUE.NOT_YET_COMPLETE_IT ? 'IT Support' : 'Cơ Điện'}</h2>
                        <button type="button" className="btn btn-primary send-support-creat" onClick={() => this.handleOpenModal()}>Tạo mới</button>
                    </div>
                    <div className='send-support-body'>
                        <table className="send-support-table table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã</th>
                                    <th>Người yêu cầu</th>
                                    <th>Người xử lý</th>
                                    <th>Loại thiết bị</th>
                                    <th>Lỗi</th>
                                    <th>Vị Trí</th>
                                    <th>Ghi chú</th>
                                    <th>Phản hồi</th>
                                    <th>Mức độ</th>
                                    <th>Thời gian báo</th>
                                    <th>Bắt đầu xử lý</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reqSupport && reqSupport.length > 0
                                    &&
                                    reqSupport.map((item, index) => {
                                        return (
                                            <>
                                                <tr key={item.id} className={`${item.priorityId === 'CO' ? "table-warning" : item.priorityId === 'TB' ? "table-success" : "table-light"}`}>
                                                    <td>{index + stt}</td>
                                                    <td>{`${CODE.IT}-${item.requestCode}`}</td>
                                                    <td>{item.userRequestData?.id ? `${item.userRequestData.firstName} ${item.userRequestData.lastName}` : ''}</td>
                                                    <td>{item?.repairerData && `${item.repairerData.firstName} ${item.repairerData.lastName}`}</td>
                                                    <td>{item.errorData?.typeError?.value || ''}</td>
                                                    <td>{item.errorData.errorName ? item.errorData.errorName : ''}</td>
                                                    <td>{item.locationRequetData?.locationName || ''}</td>
                                                    <td>{item?.note || ''}</td>
                                                    <td>{item.description ? item.description : ''}</td>
                                                    <td>{item.priorityData?.value || ''}</td>
                                                    <td>{item.createdAt ? moment.utc(item.createdAt).local().format('DD-MM-YYYY HH:mm:ss') : ''}</td>
                                                    <td>{item.repairStartTime ? moment.utc(item.repairStartTime).local().format('DD-MM-YYYY HH:mm:ss') : ''}</td>
                                                    <td>{item.statusRequest?.value || ''}</td>
                                                    <td>
                                                        <div className='send-support-icon-handle-container'>
                                                            {
                                                                item.statusRequest?.keyMap === VALUE.WAITTING &&
                                                                <>
                                                                    <div className='send-support-icon-edit' onClick={() => this.handleEditProcessing(item, item.id)}>
                                                                        <i className="fas fa-edit"></i>
                                                                    </div>
                                                                    <div className='send-icon-close' onClick={() => this.handleCancelRequest(item, item.id)}>
                                                                        <i className="far fa-trash-alt"></i>
                                                                    </div>
                                                                </>
                                                            }
                                                        </div>
                                                    </td>
                                                </tr >
                                            </>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='send-support-paginate'>
                        <ReactPaginate
                            nextLabel="next >"
                            onPageChange={this.handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={this.state.totalPages}
                            previousLabel="< previous"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                    <ModalRequestSupport
                        isOpenModal={this.state.isOpenModal}
                        toggle={this.handleOpenModal}
                        departmentId={DEPARTMENT.IT}
                        data={this.state.dataEdit}
                        getRequestSupport={this.getRequestSupport}
                        handleCloseModal={this.handleCloseModal}
                    />
                </div >
                <div className='footer-home'>
                    <HomeFooter />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
        reqSupportIt: state.user.reqSupportIt,
        reqSupportCd: state.user.reqSupportCd,
        allSupport: state.user.allSupport,
        allLocation: state.user.allLocation,
        allErrorCode: state.user.allErrorCode
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleDataHomeRedux: (data) => dispatch(actions.handleDataHomeRedux(data)),
        getAllSupport: (data) => dispatch(actions.getAllSupport(data)),
        getAllLocation: () => dispatch(actions.getAllLocation()),
        getAllErrorCode: () => dispatch(actions.getAllErrorCode()),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(SendRequest);
