import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../redux/actions";
import HomeHeader from '../../containers/HomePage/HomeHeader';
import './DeviceManagement.scss'
import Select from 'react-select';
import { DEPARTMENT } from '../../ultil/constant'
import ReactPaginate from 'react-paginate';
import { VALUE } from '../../ultil/constant';
import _ from 'lodash'
import { toast } from 'react-toastify';
import ModalAddDevice from '../modal/ModalAddDevice'


class DeviceManagement extends Component {

    state = {
        devices: [],
        currentPage: 0,
        limit: VALUE.LIMIT_DEVICES,
        totalPages: 0,
        search: "",
        isOpenModal: false,
        deviceAdded: {},
    }

    componentDidMount = async () => {
        await this.props.getAllDeviceByDepartment(DEPARTMENT.IT, this.state.limit, this.state.currentPage, this.state.search);
        await this.props.getAllSupport();
        await this.props.getAllLocation();
        await this.props.getAllDepartmentRedux();
        await this.props.getAllUser();

    };

    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (prevProps.allDevices !== this.props.allDevices) {
            this.setState({
                devices: this.props.allDevices.rows,
                totalPages: this.props.allDevices.totalPages,
            })
        }
    };

    // Xử lý khi sang trang
    handlePageClick = async (event) => {
        const newOffset = (event.selected);
        this.setState({
            currentPage: newOffset
        }, async () => await this.props.getAllDeviceByDepartment(DEPARTMENT.IT, this.state.limit, this.state.currentPage, this.state.search))
    };


    handleOnChangeInput = async (event) => {
        const value = event.target.value;
        this.setState((prevState) => ({
            ...prevState,
            search: value
        }));
    }

    handleClickSearch = async () => {
        this.setState({
            currentPage: 0,
            totalPages: 0,
        })
        const searchValue = this.state.search; // Lưu giá trị trước khi gọi setState
        this.props.getAllDeviceByDepartment(DEPARTMENT.IT, VALUE.LIMIT_DEVICES, 0, searchValue);
    }

    handleOpenOrCloseModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal,
        })
    };
    // handleFilterChange = (selectedOption, id) => {
    //     this.setState({ [id]: selectedOption ? selectedOption.value : "" });
    //     // if(selectedOption.value === )
    // };

    render() {
        const { devices, currentPage, limit } = this.state;
        let stt = currentPage > 0 ? (currentPage * limit + 1) : (currentPage + 1)
        // console.log(this.state)

        return (
            <>
                <div className='home-header'>
                    <HomeHeader />
                </div>
                <div className='device-container'>
                    <h2>Quản lý thiết bị IT</h2>
                    <div className='search-add-container'>
                        <div className="input-group mb-3 input-search">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập nội dung"
                                aria-label="Recipient's username"
                                aria-describedby="button-addon2"
                                onChange={(event) => this.handleOnChangeInput(event)}
                            />
                            <button
                                className="btn btn-warning"
                                type="button"
                                id="button-addon2"
                                onClick={() => this.handleClickSearch()}
                            >
                                Tìm kiếm
                            </button>
                        </div>
                        <button type="button" className="btn btn-primary button-add" onClick={() => this.handleOpenOrCloseModal()}>Thêm Thiết bị</button>
                    </div>
                    <table className="device-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Loại</th>
                                <th>Mã</th>
                                <th>Tên thiết bị</th>
                                <th>Bộ Phận</th>
                                <th>Người sử dụng</th>
                                <th>Vị trí</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices && devices.length > 0 &&
                                devices.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{index + stt}</td>
                                            <td>{item?.typeDevice?.value}</td>
                                            <td>{item?.deviceCode}</td>
                                            <td>{item?.deviceName}</td>
                                            <td>{item?.departmentData?.departmentName}</td>
                                            <td>{`${item?.userData?.firstName} ${item?.userData?.lastName}`}</td>
                                            <td>{item?.locationData?.locationName}</td>
                                            <td>{item?.statusDevice?.value}</td>
                                            <td><span>Chi tiết</span></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className='paginate'>
                    <ReactPaginate
                        nextLabel="next >"
                        onPageChange={this.handlePageClick}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={2}
                        pageCount={Math.max(1, this.state.totalPages)} // Đảm bảo ít nhất là 1
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
                        forcePage={this.state.currentPage} // Thêm forcePage để khi có sự thay đổi về currentPage từ việc setState ở hàm nào đó ngoài hàm handlePageClick thì sẽ cập nhật lại vị trí trang
                    />
                </div>
                <ModalAddDevice
                    isOpenModal={this.state.isOpenModal}
                    handleOpenOrCloseModal={this.handleOpenOrCloseModal}
                    allDevices={devices}
                />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        allDevices: state.manager.allDevices,
        allSupport: state.user.allSupport,
        allLocation: state.user.allLocation,
        allDepartment: state.user.allDepartment,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllDeviceByDepartment: (mngDepartmentId, limit, currentPage, search) => dispatch(actions.getAllDeviceByDepartmentredux(mngDepartmentId, limit, currentPage, search)),
        getAllSupport: (data) => dispatch(actions.getAllSupport(data)),
        getAllLocation: () => dispatch(actions.getAllLocation()),
        getAllDepartmentRedux: () => dispatch(actions.getAllDepartmentRedux()),
        getAllUser: () => dispatch(actions.getAllUserRedux()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceManagement);
