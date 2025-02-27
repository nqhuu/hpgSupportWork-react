import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../containers/HomePage/HomeHeader';
import './PersonnelManagement.scss'
import Select from 'react-select';





class PersonnelManagement extends Component {

    state = {

    }

    componentDidMount = async () => {

    };

    componentDidUpdate = async (prevProps, prevState, snapshot) => {

    };

    render() {
        return (
            <>
                <HomeHeader />
                <div className="personnel-container">
                    <h2>Quản lý User / Nhân viên</h2>
                    <div className='search-add-container'>
                        <Select
                            className='select-search'
                            placeholder='Tìm kiếm nhân viên'
                        // value={!_.isEmpty(userUpdate[0]) && item.id === userUpdate[0].id ? userUpdate[0].statusUserId : item.statusUserId}
                        // options={listStatusUserReport}
                        // name='statusUserId'
                        // isDisabled={this.props.allPersonnel && this.props.allPersonnel.length > 0 && idDisable !== item.userId}
                        // onChange={(selectOptions, actionMeta) => this.handleChangeSelect(selectOptions, actionMeta, item.userId)}
                        />
                        <button type="button" class="btn btn-outline-primary">Thêm nhân viên</button>
                    </div>
                    <div >
                        <table >
                            <thead>
                                <tr>
                                    <th>Mã NV</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Điện thoại</th>
                                    <th>Phòng ban</th>
                                    <th>Chức vụ</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <td>Mã nv</td>
                                    <td>Họ tên</td>
                                    <td>Email</td>
                                    <td>PhoneNumber</td>
                                    <td>Bộ phận</td>
                                    <td>Chức vụ</td>
                                    <td>
                                        <button onClick={() => this.props.onEdit()}>✏️ Sửa</button>
                                        <button onClick={() => this.props.onDelete()}>🗑️ Xóa</button>
                                    </td>
                                </tr>
                                <tr >
                                    <td>Mã nv</td>
                                    <td>Họ tên</td>
                                    <td>Email</td>
                                    <td>PhoneNumber</td>
                                    <td>Bộ phận</td>
                                    <td>Chức vụ</td>

                                    <td>
                                        <button onClick={() => this.props.onEdit()}>✏️ Sửa</button>
                                        <button onClick={() => this.props.onDelete()}>🗑️ Xóa</button>
                                    </td>
                                </tr>
                                <tr >
                                    <td>Mã nv</td>
                                    <td>Họ tên</td>
                                    <td>Email</td>
                                    <td>PhoneNumber</td>
                                    <td>Bộ phận</td>
                                    <td>Chức vụ</td>
                                    <td>
                                        <button onClick={() => this.props.onEdit()}>✏️ Sửa</button>
                                        <button onClick={() => this.props.onDelete()}>🗑️ Xóa</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </>

        )
    }
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonnelManagement);
