import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import './ItSupport.scss'
import * as actions from "../../redux/actions";
import { VALUE, CODE, DEPARTMENT } from '../../ultil/constant';
import { handleDataRequestSupport, getAllUser, updateRequestSupport } from '../../services/userService'
import Select from 'react-select';
import _ from 'lodash'
import HomeFooter from '../../containers/HomePage/HomeFooter'
import ModalRequestSupport from '../modal/ModalRequestSupport'
import moment from 'moment'
import { toast } from 'react-toastify';

class ItSupport extends Component {

    state = {
        showHandle: false,

        showHide: false,
        reqSupport: [],
        currentPage: 0,
        totalPages: 0,
        isDeparment: VALUE.NOT_YET_COMPLETE_IT,
        selectRequestId: '',
        selectedOption: {},
        ListUserRep: [],
        listUser: [],
        // isOpenSelect: false,
        isOpenModal: false,
        note: '',
        dataEdit: {},
    }

    componentDidMount = async () => {

        await this.getRequestSupport();
        await this.getAllUser();
        await this.props.getAllSupport()
        await this.props.getAllLocation()
        await this.props.getAllErrorCode()

    }

    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (prevProps.reqSupport !== this.props.reqSupport) {
            let data = this.props.reqSupport
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
                status: VALUE.CANCEL
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
        let { reqSupport, currentPage, selectRequestId, note, isSuccess, listUser, selectedOption, ListUserRep } = this.state
        let stt = currentPage * VALUE.LIMIT_HANDLE + 1

        return (
            <>
                <div className='it-create-support-container'>
                    <div className='it-support-header'>
                        <h2 className='it-support-text'>IT Support</h2>
                        <button type="button" className="btn btn-primary it-support-creat" onClick={() => this.handleOpenModal()}>Tạo mới</button>
                    </div>
                    <div className='it-support-body'>
                        <table className="it-support-table table">
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
                                                    <td>{item?.note || ''}
                                                        {/* {
                                                            selectRequestId === item.id ?
                                                                <input
                                                                    type='text'
                                                                    value={note}
                                                                    onChange={(event) => this.handleChangeInput(event, 'note')}
                                                                    className='input-edit'
                                                                />
                                                                :
                                                                item.note || ''

                                                        } */}
                                                    </td>
                                                    <td>{item.description ? item.description : ''}</td>
                                                    <td>{item.priorityData?.value || ''}</td>
                                                    <td>{item.createdAt ? moment.utc(item.createdAt).local().format('DD-MM-YYYY HH:mm:ss') : ''}</td>
                                                    <td>{item.repairStartTime ? moment.utc(item.repairStartTime).local().format('DD-MM-YYYY HH:mm:ss') : ''}</td>
                                                    <td>{item.statusRequest?.value || ''}</td>
                                                    <td>
                                                        <div className='it-support-icon-handle-container'>
                                                            {
                                                                item.statusRequest?.keyMap === VALUE.WAITTING &&
                                                                <>
                                                                    <div className='it-support-icon-edit' onClick={() => this.handleEditProcessing(item, item.id)}>
                                                                        <i className="fas fa-edit"></i>
                                                                    </div>
                                                                    <div className=' it-icon-close' onClick={() => this.handleCancelRequest(item, item.id)}>
                                                                        <i className="fas fa-minus-square"></i>
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
                    <div className='it-support-paginate'>
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
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
        reqSupport: state.user.reqSupport,
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


export default connect(mapStateToProps, mapDispatchToProps)(ItSupport);
