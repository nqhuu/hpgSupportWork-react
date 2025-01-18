import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import './ItHandleSupport.scss'
import * as actions from "../../redux/actions";
import { VALUE, CODE } from '../../ultil/constant';
import { handleDataRequestSupport, getAllUser } from '../../services/userService'
import HomeHeader from '../../containers/HomePage/HomeHeader';
import Select from 'react-select';
import _ from 'lodash'
import { withRouter } from 'react-router-dom';






class ItHandleSupport extends Component {
    state = {
        reqSupport: [],
        currentPage: 0,
        limit: '',
        totalPages: 0,
        isDeparment: '',
        idHandleSelect: {
            itemClick: ''
        },
        selectedOption: {},
        ListUserRep: [],
        listUser: [],
        isOpenSelect: false,
        showHandle: false

    }

    componentDidMount = async () => {
        if (!this.props.showHandle) {
            this.setState({
                limit: VALUE.LIMIT,
                isDeparment: this.props.department
            }, async () => await this.getRequestSupport())
        }

        if (this.props.location?.state?.showHandle) {
            let { state } = this.props.location
            console.log(state)
            this.setState({
                showHandle: state.showHandle,
                limit: VALUE.LIMIT_HANDLE,
                isDeparment: this.props.location?.state?.department
            }, async () => await this.getRequestSupport())
        }

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
                console.log(listUser)
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
        let response = await handleDataRequestSupport(this.state.isDeparment, this.state.currentPage, this.state.limit)
        if (response && response.errCode === 0) {
            let data = response.data
            await this.props.handleDataHomeRedux(data)
        }
    }

    GoToItHandle = async () => {
        this.props.history.push({
            pathname: '/support/it-handle', // Đường dẫn cần điều hướng '/support/it-handle'
            state: { department: VALUE.NOT_YET_COMPLETE_IT, showHandle: true }, // Các props bổ sung
        });
    }

    // Xử lý khi sang trang
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


    handleComplete = async () => {
        alert('hoàn thành')
    }

    setIsOpen = async (bolean) => {
        this.setState({
            isOpenSelect: bolean
        })
    }

    render() {
        let { reqSupport, showHandle, currentPage, limit, idHandleSelect, isSuccess, listUser, selectedOption, ListUserRep } = this.state
        let stt = currentPage * limit + 1

        return (
            <>
                {showHandle &&
                    <HomeHeader />
                }
                <div className='handle-support-container'>
                    {showHandle &&
                        <div className='header-it'><h2>Xử lý yêu cầu IT</h2></div>
                    }
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
                                {showHandle &&
                                    <th>Trạng thái</th>
                                }
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reqSupport && reqSupport.length > 0
                                ?
                                reqSupport.map((item, index) => {
                                    return (
                                        <>
                                            <tr key={item.id} className={`${item.priorityId === 'CO' ? "table-warning" : item.priorityId === 'TB' ? "table-success" : "table-light"}`}>
                                                <td>{index + stt}</td>
                                                <td>{`${CODE.IT}-${item.requestCode}`}</td>
                                                <td>{item.userRequestData?.id ? `${item.userRequestData.firstName} ${item.userRequestData.lastName}` : ''}</td>
                                                <td className='select-container'>
                                                    {
                                                        item.statusRequest?.keyMap === VALUE.WAITTING && (
                                                            idHandleSelect?.itemClick === item.id &&
                                                            <Select
                                                                value={selectedOption}
                                                                options={ListUserRep}
                                                                onChange={this.handleChange}
                                                                className='is-select'
                                                            />)
                                                    }
                                                    {
                                                        item.statusRequest?.keyMap === VALUE.PROCESSING && (
                                                            idHandleSelect.itemClick === item.id ?
                                                                <Select
                                                                    value={selectedOption}
                                                                    options={ListUserRep}
                                                                    onChange={this.handleChange}
                                                                    className='is-select'
                                                                />
                                                                :
                                                                item?.repairerData && `${item.repairerData.firstName} ${item.repairerData.lastName}`
                                                        )
                                                    }

                                                </td>
                                                <td>{item.errorData?.typeError?.value || ''}</td>
                                                <td>{item.errorData.errorName ? item.errorData.errorName : ''}</td>
                                                <td>{item.locationRequetData?.locationName || ''}</td>
                                                <td>{item.note ? item.note : ''}</td>
                                                <td>{item.description ? item.description : ''}</td>
                                                <td>{item.priorityData?.value || ''}</td>
                                                <td>{item.createdAt ? item.createdAt : ''}</td>
                                                <td>{item.repairStartTime ? item.repairStartTime : ''}</td>
                                                <td>{item.statusRequest?.value || ''}</td>
                                                {showHandle &&

                                                    <td>
                                                        <div className='icon-handle-container'>
                                                            {
                                                                item.statusRequest?.keyMap === VALUE.WAITTING && (
                                                                    idHandleSelect.itemClick === item.id ?
                                                                        <>
                                                                            <div className='icon-handle icon-close' onClick={(event) => this.handleProcessing(event, item.id)}>
                                                                                <i className="fas fa-window-close"></i>
                                                                            </div>
                                                                            <div className='icon-save' onClick={(event) => this.handleSave(event)}>
                                                                                <div><i className="fas fa-save"></i> </div>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <div className='icon-handle' onClick={(event) => this.handleProcessing(event, item.id)}><i className="fas fa-wrench"></i></div>
                                                                )
                                                            }

                                                            {
                                                                item.statusRequest?.keyMap === VALUE.PROCESSING && (
                                                                    idHandleSelect.itemClick === item.id ?
                                                                        <>
                                                                            <div className='icon-handle icon-close' onClick={(event) => this.handleProcessing(event, item.id)}>
                                                                                <i className="fas fa-window-close"></i>
                                                                            </div>
                                                                            <div className='icon-save' onClick={(event) => this.handleSave(event)}>
                                                                                <div><i className="fas fa-save"></i> </div>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <div className='icon-handle' onClick={(event) => this.handleProcessing(event, item.id)}><i className="fas fa-edit"></i></div>
                                                                            <div className='icon-complete' onClick={() => this.handleComplete()}>
                                                                                <i className="fas fa-check"></i>
                                                                            </div>
                                                                        </>
                                                                )
                                                            }


                                                        </div>
                                                    </td>
                                                }
                                            </tr >
                                        </>
                                    )
                                })
                                :
                                <tr>
                                    <td>Tuyệt vời, bộ phận bạn đang xử lý công việc rất tốt</td>
                                </tr>
                            }
                        </tbody>

                    </table>
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

                    {!this.props.showHandle && reqSupport && reqSupport.length > 0 &&
                        <div className='view-btn'>
                            <button className=' btn btn-warning'
                                onClick={this.GoToItHandle}
                            >
                                View
                            </button>
                        </div>
                    }
                    {/* <ModalHandleRequest
                    isOpenModal={this.state.isOpenModal}
                /> */}
                </div >
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        reqSupport: state.user.reqSupport
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleDataHomeRedux: (data) => dispatch(actions.handleDataHomeRedux(data))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ItHandleSupport));
