import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import './ItSupport.scss'
import * as actions from "../../redux/actions";
import { VALUE, CODE } from '../../ultil/constant';
import { handleDataHome, getAllUser } from '../../services/userService'
import Select from 'react-select';
import _ from 'lodash'
import HomeFooter from '../../containers/HomePage/HomeFooter'
import ModalRequestSupport from '../modal/ModalRequestSupport'

class ItSupport extends Component {

    state = {
        showHide: false,
        reqSupport: [],
        currentPage: 0,
        limit: VALUE.LIMIT_HANDLE,
        totalPages: 0,
        isDeparment: VALUE.IT_HOME,
        idHandleSelect: {
            itemClick: ''
        },
        selectedOption: {},
        ListUserRep: [],
        listUser: [],
        isOpenSelect: false,
        isOpenModal: true
    }

    componentDidMount = async () => {

        await this.getRequestSupport();
        await this.getAllUser();

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
        let response = await handleDataHome(this.state.isDeparment, this.state.currentPage, this.state.limit, this.props.userInfo.id)
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

    handleProcessing = async (event, id) => {
        let idHandleSelectCopy = { ...this.state.idHandleSelect };

        if (idHandleSelectCopy.itemClick === id) {
            idHandleSelectCopy = {};
            this.setState({
                idHandleSelect: idHandleSelectCopy
            })
            return;
        }

        if (!idHandleSelectCopy.itemClick || idHandleSelectCopy.itemClick !== id) {
            idHandleSelectCopy.itemClick = id
            this.setState({
                idHandleSelect: idHandleSelectCopy
            })
        }
    }

    handleChange = async (selectedOption) => {
        console.log(selectedOption)
        this.setState({
            selectedOption: selectedOption
        })
    }


    handleSave = async (event) => {
        alert('save all')

    }


    handleCancelRequest = async () => {
        alert('Hủy yêu cầu')
    }

    handleOpenModal = async () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal
        })
    }

    render() {
        let { reqSupport, currentPage, limit, idHandleSelect, isSuccess, listUser, selectedOption, ListUserRep } = this.state
        let stt = currentPage * limit + 1
        return (
            <>
                <div className='it-handle-support-container'>
                    <div className='it-header-it'>
                        <h2 className='it-text'>IT Support</h2>
                        <button type="button" className="btn btn-primary it-creat-support" onClick={() => this.handleOpenModal()}>Tạo mới</button>
                    </div>
                    <table className="table">
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
                                                <td>{`${CODE.HPG}-${index < 10 ? `000${index + 1}` : index > 10 && index < 100 ? `00${index + 1}` : index + 1}`}</td>
                                                <td>{item.userRequestData?.id ? `${item.userRequestData.firstName} ${item.userRequestData.lastName}` : ''}</td>
                                                <td>{item?.repairerData && `${item.repairerData.firstName} ${item.repairerData.lastName}`}</td>
                                                <td>{item.errorData?.typeError?.value || ''}</td>
                                                <td>{item.errorData.errorName ? item.errorData.errorName : ''}</td>
                                                <td>{item.locationRequetData?.locationName || ''}</td>
                                                <td>{item.description ? item.description : ''}</td>
                                                <td>{item.description ? item.description : ''}</td>
                                                <td>{item.priorityData?.value || ''}</td>
                                                <td>{item.createdAt ? item.createdAt : ''}</td>
                                                <td>{item.repairStartTime ? item.repairStartTime : ''}</td>
                                                <td>{item.statusRequest?.value || ''}</td>
                                                <td>
                                                    <div className='it-icon-handle-container'>
                                                        {
                                                            item.statusRequest?.keyMap === VALUE.WAITTING && (
                                                                idHandleSelect.itemClick === item.id ?
                                                                    <>
                                                                        <div className='it-icon-handle it-icon-close' onClick={(event) => this.handleProcessing(event, item.id)}>
                                                                            <i className="fas fa-window-close"></i>
                                                                        </div>

                                                                        <div className='it-icon-save' onClick={(event) => this.handleSave(event)}>
                                                                            <div><i className="fas fa-save"></i> </div>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <div className='it-icon-handle' onClick={(event) => this.handleProcessing(event, item.id)}><i className="fas fa-edit"></i></div>
                                                                        <div className='it-icon-handle it-icon-close' onClick={(event) => this.handleCancelRequest(event, item.id)}>
                                                                            <i className="fas fa-minus-square"></i>
                                                                        </div>
                                                                    </>

                                                            )
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
                    <div className='it-paginate'>
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
        reqSupport: state.user.reqSupport
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleDataHomeRedux: (data) => dispatch(actions.handleDataHomeRedux(data))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ItSupport);
