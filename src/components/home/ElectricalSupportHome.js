import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../redux/actions";





class ElectricalSupportHome extends Component {

    state = {
        showHide: false,
        reqSupport: [],
        // personnelReport: [],
    }

    componentDidMount = async () => {

    }

    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (prevProps.dataHome.reqSupport !== this.props.dataHome.reqSupport) {
            this.setState({
                reqSupport: this.props.dataHome.reqSupport
            })
        }
    }


    render() {
        let { reqSupport, showHide } = this.state
        let req = reqSupport.filter((reqS, index) => reqS.statusId !== "ER2" && reqS.mngDepartmentId === 'B6')
        console.log(req)
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
                            {showHide && <th>Hành động</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {req && req.length > 0 &&
                            req.map((item, index) => {
                                return (
                                    <>
                                        <tr className={`${item.priorityId === 'CO' ? "table-warning" : item.priorityId === 'TB' ? "table-success" : "table-light"}`}>
                                            <td>{index + 1}</td>
                                            <td>{item.userId}</td>
                                            <td>{item.repairer ? item.repairer : ''}</td>
                                            <td>{item.errorData.typeError.value ? item.errorData.typeError.value : ''}</td>
                                            <td>{item.errorData.errorName ? item.errorData.errorName : ''}</td>
                                            <td>{item.locationRequetData && item.locationRequetData.locationName ? item.locationRequetData.locationName : ''}</td>
                                            <td>{item.description ? item.description : ''}</td>
                                            <td>{item.priorityData.value ? item.priorityData.value : ''}</td>
                                            <td>{item.createdAt ? item.createdAt : ''}</td>
                                            <td>{item.repairStartTime ? item.repairStartTime : ''}</td>
                                            <td>{item.statusRequest.value ? item.statusRequest.value : ''}</td>
                                            {showHide &&
                                                <th>
                                                    <div>Xử lý</div>
                                                    <div>Hoàn Thành</div>
                                                </th>
                                            }

                                        </tr>
                                    </>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        dataHome: state.user.dataHome
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ElectricalSupportHome);
