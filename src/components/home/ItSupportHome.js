import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { push } from "connected-react-router";
// import * as actions from "../../redux/actions";
import ReactPaginate from 'react-paginate';
import './ItSupportHome.scss'
// import { current } from '@reduxjs/toolkit';
import { handleDataHome } from '../../services/userService'
import { VALUE } from '../../ultil/constant';







class ItSupportHome extends Component {

    state = {
        showHide: false,
        reqSupport: [],
        currentPage: 0,
        limit: VALUE.LIMIT,
        totalPages: 0,
        isDeparment: VALUE.IT_HOME
        // personnelReport: [],
    }

    componentDidMount = async () => {
        await this.getRequestSupport()
    }

    componentDidUpdate = async (prevProps, prevState, snapshot) => {

    }

    getRequestSupport = async () => {
        let response = await handleDataHome(this.state.isDeparment, this.state.currentPage, this.state.limit)
        if (response && response.errCode === 0) {
            let data = response.data
            this.setState({
                reqSupport: data.reqSupport.rows,
                totalPages: data.reqSupport.totalPages,
            })
            // await this.props.handleDataHomeRedux(data)
        }
    }

    // Xử lý khi chuyển trang
    handlePageClick = async (event) => {
        const newOffset = (event.selected);
        this.setState({
            currentPage: newOffset
        }, () => this.getRequestSupport(this.state.isDeparment, this.state.currentPage, this.state.limit))
    };

    render() {
        let { reqSupport, currentPage, limit } = this.state
        let stt = currentPage * limit + 1
        return (
            <div className='container mt-3'>
                <table className="table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Người yêu cầu</th>
                            <th>Người xử lý</th>
                            <th>Loại thiết bị</th>
                            <th>Lỗi</th>
                            <th>Vị Trí</th>
                            <th>Ghi chú</th>
                            <th>Mức độ</th>
                            <th>Thời gian báo</th>
                            <th>Thời gian bắt đầu xử lý</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reqSupport && reqSupport.length > 0
                            ?
                            reqSupport.map((item, index) => {
                                return (
                                    <>
                                        <tr key={item.id || index} className={`${item.priorityId === 'CO' ? "table-warning" : item.priorityId === 'TB' ? "table-success" : "table-light"}`}>
                                            <td>{index + stt}</td>
                                            <td>{item.userRequestData?.id ? `${item.userRequestData.firstName} ${item.userRequestData.lastName}` : ''}</td>
                                            <td>{item.repairerData?.id ? `${item.repairerData.firstName} ${item.repairerData.lastName}` : ''}</td>
                                            <td>{item.errorData?.typeError?.value || ''}</td>
                                            <td>{item.errorData.errorName ? item.errorData.errorName : ''}</td>
                                            <td>{item.locationRequetData?.locationName || ''}</td>
                                            <td>{item.description ? item.description : ''}</td>
                                            <td>{item.priorityData?.value || ''}</td>
                                            <td>{item.createdAt ? item.createdAt : ''}</td>
                                            <td>{item.repairStartTime ? item.repairStartTime : ''}</td>
                                            <td>{item.statusRequest?.value || ''}</td>
                                        </tr>
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
                <button className='view btn btn-warning'>View</button>
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
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // handleDataHomeRedux: (data) => dispatch(actions.handleDataHomeRedux(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ItSupportHome);
