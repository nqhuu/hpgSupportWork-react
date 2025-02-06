import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import './HandleRequest.scss'
import * as actions from "../../redux/actions";
import { VALUE, CODE, path } from '../../ultil/constant';
import { handleDataRequestSupport, getAllUser, updateRequestSupport } from '../../services/userService'
import HomeHeader from '../../containers/HomePage/HomeHeader';
import Select from 'react-select';
import _ from 'lodash'
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment'




class HandleRequest extends Component {
    state = {
        reqSupport: [],
        currentPage: 0,
        limit: '',
        totalPages: 0,
        // isDeparment: VALUE.NOT_YET_COMPLETE_IT,
        isDeparment: '',
        selectRequestId: '',
        selectedOption: {},
        ListUserRep: [],
        listUser: [],
        isOpenSelect: false,
        showHandle: '',
        description: ''

    }

    componentDidMount = async () => {

        let showHandle = this.props?.showHandle ?? true;
        let limit = this.props?.showHandle === false ? VALUE.LIMIT : VALUE.LIMIT_HANDLE
        if (!this.props?.showHandle) {
            this.setState({
                limit: limit,
                showHandle: showHandle,
                isDeparment: this.props.department
            }, async () => {
                await this.getRequestSupport();
                await this.getAllUser();
            })
        }



    }

    componentDidUpdate = async (prevProps, prevState, snapshot) => {

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
                let selectedOptionCopy = {}
                selectedOptionCopy.value = listUser.data[0].id
                selectedOptionCopy.label = `${listUser.data[0].firstName} ${listUser.data[0].lastName}`

                let stateCopy = { ...this.state };
                stateCopy.listUser = listUser.data;
                stateCopy.ListUserRep = ListUserRep;
                stateCopy.selectedOption = selectedOptionCopy
                this.setState({
                    ...stateCopy
                })
            }
        }
    }

    getRequestSupport = async () => {
        let response = await handleDataRequestSupport(this.state.isDeparment, this.state.currentPage, this.state.limit)
        if (response && response.errCode === 0) {
            let data = response.data
            data.isDeparment = this.state.isDeparment
            // console.log('duLieu', data)
            await this.props.handleDataHomeRedux(data)
        }
    }

    GoToItHandle = async () => {
        this.props.history.push('/support/it-handle')
        //     ({
        //     pathname: '/support/it-handle', // Đường dẫn cần điều hướng 
        //     state: { department: VALUE.NOT_YET_COMPLETE_IT, showHandle: true }, // Các props bổ sung
        // });
    }

    // Xử lý khi sang trang
    handlePageClick = async (event) => {
        const newOffset = (event.selected);
        this.setState({
            currentPage: newOffset
        }, () => this.getRequestSupport(this.state.isDeparment, this.state.currentPage, this.state.limit))
    };

    handleProcessing = async (item, id) => {

        if (!item) {
            console.error('Item is undefined or null:', item);
            return;
        }

        if (item.repairer) {
            let selectedOption = {
                value: item.id,
                label: `${item.repairerData.firstName} ${item.repairerData.lastName}`
            };
            this.setState({
                description: item?.description || '',
                selectRequestId: id,
                selectedOption: selectedOption,
                description: item.description
            })
        }

        if (!item.repairer) {
            let { listUser } = this.state
            let selectedOption = {
                value: listUser[0].id,
                label: `${listUser[0].firstName} ${listUser[0].lastName}`
            };
            this.setState({
                selectRequestId: id,
                selectedOption: selectedOption,
                description: item?.description || ''
            })
        }

    }

    closeHandleProcessing = async (item, id) => {
        this.setState({
            selectRequestId: '',
        })
    }

    handleChange = async (selectedOption) => {
        this.setState({
            selectedOption: selectedOption
        })
    }


    handleSave = async (item) => {
        let { description, selectedOption } = this.state
        let data = {
            requestId: item.id,
            repairer: selectedOption,
            description: description,
            handleRequest: VALUE.HANDLE_REQUEST
        }

        if (data) {
            let response = await updateRequestSupport(data)
            if (response && response.errCode === 0) {
                toast.success(response.errMessage)
                this.getRequestSupport()
                this.closeHandleProcessing()
            }
        }

    }


    handleChangeInput = async (event, id) => {
        this.setState({
            [id]: event.target.value
        })
    }

    handleComplete = async (item) => {
        if (window.confirm("Xác nhận đã xử lý xong")) {
            let data = {
                requestId: item.id,
                statusId: item.statusId,
                handleCompleteRequest: VALUE.COMPLETE
            }
            if (data) {
                let response = await updateRequestSupport(data)
                console.log('updateRequestSupport', response)
                if (response && response.errCode === 0) {
                    toast.success(response.errMessage)
                    this.getRequestSupport()
                }
            }
        }
    }

    setIsOpen = async (bolean) => {
        this.setState({
            isOpenSelect: bolean
        })
    }

    handleViewImg = async (imgLink) => {
        // Chuyển đổi UNC sang file://
        const fileUrl = `file://${imgLink.replace(/\\/g, '/')}`;
        console.log("Mở file:", fileUrl);
        window.open(fileUrl, "_blank"); // Mở file trong tab mới

        // Chuyển UNC sang HTTP
        // const httpUrl = imgLink.replace(/\\/g, '/').replace('//192.168.1.68', 'http://192.168.1.68');
        // console.log("Mở link HTTP:", httpUrl);
        // window.open(httpUrl, "_blank"); // Mở trong tab mới

    }

    render() {
        let { reqSupport, showHandle, currentPage, limit, selectRequestId, listUser, description, selectedOption, ListUserRep } = this.state
        let stt = currentPage * limit + 1
        return (
            <>
                {showHandle &&
                    <HomeHeader />
                }
                <div className={`${showHandle ? "handle-support-container-active table-responsive" : "handle-support-container table-responsive"}`}>
                    {showHandle &&
                        <div className='header-it'><h2>Xử lý yêu cầu IT</h2></div>
                    }
                    <table className="table table-responsive">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã</th>
                                <th>Người yêu cầu</th>
                                <th>Người xử lý</th>
                                <th>Loại thiết bị</th>
                                <th>Lỗi</th>
                                <th>Vị Trí</th>
                                <th>Hình ảnh</th>
                                <th>Ghi chú</th>
                                <th>Phản hồi</th>
                                <th>Mức độ</th>
                                <th>Thời gian báo</th>
                                <th>Bắt đầu xử lý</th>
                                {showHandle && <th>Trạng thái</th>}
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reqSupport && reqSupport.length > 0
                                ?
                                reqSupport.map((item, index) => {
                                    return (
                                        <>
                                            <tr key={item.id || `${item.requestCode}-${index}`} className={`${item.priorityId === 'CO' ? "table-warning" : item.priorityId === 'TB' ? "table-success" : "table-light"}`}>
                                                <td>{index + stt}</td>
                                                <td>{`${CODE.IT}-${item.requestCode}`}</td>
                                                <td>{item.userRequestData?.id ? `${item.userRequestData.firstName} ${item.userRequestData.lastName}` : ''}</td>
                                                <td className='select-container'>
                                                    {
                                                        item.statusRequest?.keyMap === VALUE.WAITTING && (
                                                            selectRequestId === item.id &&
                                                            <Select
                                                                value={selectedOption}
                                                                options={ListUserRep}
                                                                onChange={this.handleChange}
                                                                className='is-select'
                                                                classNamePrefix="is-select"
                                                            />)
                                                    }
                                                    {
                                                        item.statusRequest?.keyMap === VALUE.PROCESSING && (
                                                            selectRequestId === item.id ?
                                                                <Select
                                                                    value={selectedOption}
                                                                    options={ListUserRep}
                                                                    onChange={this.handleChange}
                                                                    className='is-select'
                                                                    classNamePrefix="is-select"  // sử dụng để css class is-select với tiền tố cụ thể VD:  is-select__control, is-select__menu
                                                                />
                                                                :
                                                                item?.repairerData && `${item.repairerData.firstName} ${item.repairerData.lastName}`
                                                        )
                                                    }
                                                </td>
                                                <td>{item.errorData?.typeError?.value || ''}</td>
                                                <td>{item.errorData.errorName ? item.errorData.errorName : ''}</td>
                                                <td>{item.locationRequetData?.locationName || ''}</td>
                                                <td>{item?.img ? <button className='btn' onClick={() => this.handleViewImg(item?.img)}>xem ảnh</button> : ''}</td>
                                                <td>{item.note ? item.note : ''}</td>
                                                <td>
                                                    {
                                                        item.statusRequest?.keyMap === VALUE.WAITTING && (
                                                            selectRequestId === item.id &&
                                                            <input
                                                                type='text'
                                                                value={description}
                                                                onChange={(event) => this.handleChangeInput(event, 'description')}
                                                                className='input-description'
                                                            />
                                                        )
                                                    }
                                                    {
                                                        item.statusRequest?.keyMap === VALUE.PROCESSING && (
                                                            selectRequestId === item.id ?
                                                                <input
                                                                    type='text'
                                                                    value={description}
                                                                    onChange={(event) => this.handleChangeInput(event, 'description')}
                                                                    className='input-description'
                                                                />
                                                                :
                                                                item?.description || '')
                                                    }
                                                </td>
                                                <td>{item.priorityData?.value || ''}</td>
                                                <td>{item.createdAt ? moment.utc(item.createdAt).local().format('DD-MM-YYYY HH:mm:ss') : ''}</td>
                                                <td>{item.repairStartTime ? moment.utc(item.repairStartTime).local().format('DD-MM-YYYY HH:mm:ss') : ''}</td>
                                                <td>{item.statusRequest?.value || ''}</td>
                                                {showHandle &&
                                                    <td>
                                                        <div className='icon-handle-container'>
                                                            {
                                                                item.statusRequest?.keyMap === VALUE.WAITTING && (
                                                                    selectRequestId === item.id ?
                                                                        <>
                                                                            <div className='icon-handle icon-close' onClick={() => this.closeHandleProcessing(item, item.id)}>
                                                                                <i className="fas fa-window-close"></i>
                                                                            </div>
                                                                            <div className='icon-save' onClick={() => this.handleSave(item)}>
                                                                                <div><i className="fas fa-save"></i> </div>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <div className='icon-handle' onClick={() => this.handleProcessing(item, item.id)}>
                                                                            <i className="fas fa-wrench"></i>
                                                                        </div>
                                                                )
                                                            }
                                                            {
                                                                item.statusRequest?.keyMap === VALUE.PROCESSING && (
                                                                    selectRequestId === item.id ?
                                                                        <>
                                                                            <div className='icon-handle icon-close' onClick={() => this.closeHandleProcessing(item, item.id)}>
                                                                                <i className="fas fa-window-close"></i>
                                                                            </div>
                                                                            <div className='icon-save' onClick={() => this.handleSave(item)}>
                                                                                <div><i className="fas fa-save"></i> </div>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <div className='icon-handle' onClick={() => this.handleProcessing(item, item.id)}>
                                                                                <i className="fas fa-edit"></i>
                                                                            </div>
                                                                            <div className='icon-complete' onClick={() => this.handleComplete(item)}>
                                                                                <i className="fas fa-check"></i>
                                                                            </div>
                                                                        </>
                                                                )}
                                                        </div>
                                                    </td>
                                                }
                                            </tr >
                                        </>
                                    )
                                })
                                :
                                <tr><td>Tuyệt vời, bộ phận bạn đang xử lý công việc rất tốt</td></tr>
                            }
                        </tbody>
                    </table>
                    <div className='active-footer'>
                        <div className='paginate'>
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
                        {!showHandle && reqSupport && reqSupport.length > 0 &&
                            <div className='view-btn'>
                                <button className=' btn btn-warning'
                                    onClick={this.GoToItHandle}
                                >
                                    View
                                </button>
                            </div>}
                    </div>
                </div >
            </>
        )
    }
}

const mapStateToProps = state => {

    return {
        isLoggedIn: state.user.isLoggedIn,
        reqSupportIt: state.user.reqSupportIt,
        reqSupportCd: state.user.reqSupportCd
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleDataHomeRedux: (data) => dispatch(actions.handleDataHomeRedux(data))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandleRequest));
