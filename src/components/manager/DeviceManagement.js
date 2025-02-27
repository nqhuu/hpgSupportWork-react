import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../redux/actions";
import HomeHeader from '../../containers/HomePage/HomeHeader';
import './DeviceManagement.scss'
import Select from 'react-select';
import { DEPARTMENT } from '../../ultil/constant'
import ReactPaginate from 'react-paginate';
import { VALUE } from '../../ultil/constant';


class DeviceManagement extends Component {

    state = {
        devices: [],
        currentPage: 0,
        limit: VALUE.LIMIT_DEVICES,
        totalPages: 0,
        filterType: "",
    }

    componentDidMount = async () => {
        await this.props.getAllDeviceByDepartment(DEPARTMENT.IT, this.state.limit, this.state.currentPage);
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
        }, async () => await this.props.getAllDeviceByDepartment(DEPARTMENT.IT, this.state.limit, this.state.currentPage))
    };

    handleFilterChange = (selectedOption) => {
        this.setState({ filterType: selectedOption ? selectedOption.value : "" });
    };

    render() {
        const { devices, currentPage, limit } = this.state;

        console.log(this.state)
        return (
            <>
                <HomeHeader />
                <div className='device-container'>
                    <h2>Quản lý thiết bị IT</h2>
                    <div className='search-add-container'>
                        <Select
                            className='select-search'
                            options={[
                                { value: "Laptop", label: "Laptop" },
                                { value: "Chủng loại", label: "Chủng loại" },
                                { value: "Bộ phận", label: "Bộ phận" },
                                { value: "Thiết bị", label: "Thiết bị" },
                                { value: "Vị trí", label: "Vị trí" },
                                { value: "Người sử dụng", label: "Người sử dụng" },
                            ]}
                            placeholder="Lọc theo ..."
                            onChange={this.handleFilterChange}
                            isClearable
                        /><Select
                            className='select-search'
                            // options={[
                            //     { value: "Laptop", label: "Laptop" },
                            //     { value: "Chủng loại", label: "Chủng loại" },
                            //     { value: "Bộ phận", label: "Bộ phận" },
                            //     { value: "Thiết bị", label: "Thiết bị" },
                            //     { value: "Vị trí", label: "Vị trí" },
                            //     { value: "Người sử dụng", label: "Người sử dụng" },
                            // ]}
                            placeholder="Lựa chọn"
                            onChange={this.handleFilterChange}
                            isClearable
                        />
                        <button type="button" class="btn btn-warning">Tìm kiếm</button>
                    </div>
                    <table className="device-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã</th>
                                <th>Loại</th>
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
                                    let stt = currentPage === 0 ? index + 1 : (index + (currentPage * limit) + 1)
                                    return (
                                        <tr key={item.id}>
                                            <td>{stt}</td>
                                            <td>{item?.diviceCode}</td>
                                            <td>{item?.typeDevice?.value}</td>
                                            <td>{item?.deviceName}</td>
                                            <td>{item?.departmentData?.departmentName}</td>
                                            <td>{`${item?.userData?.firstName} ${item?.userData?.lastName}`}</td>
                                            <td>{item?.locationData.locationName}</td>
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
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        allDevices: state.manager.allDevices
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllDeviceByDepartment: (mngDepartmentId, limit, currentPage) => dispatch(actions.getAllDeviceByDepartmentredux(mngDepartmentId, limit, currentPage)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceManagement);
