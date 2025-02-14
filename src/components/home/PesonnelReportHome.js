import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../redux/actions/actionTypes";
import './PesonnelReportHome.scss'




class PesonnelReportHome extends Component {

    state = {

    }
    render() {
        return (
            <>
                <div className="personnel-home-container">
                    <div className="personnel-home-report-department">
                        <div className="department-name">Tổ Cắt</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa chính:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Tăng ca:</span> <span>2</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa phụ:</span> <span>1</span>
                            </div>
                        </div>
                        <div className='department-content-right'>
                            <div className="report-item">
                                <span>Đi muộn:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                            <div className="report-item">
                                <span>Nghỉ:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                        </div>
                    </div>
                    <div className="personnel-home-report-department">
                        <div className="department-name">Tổ Mài</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa chính:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Tăng ca:</span> <span>2</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa phụ:</span> <span>1</span>
                            </div>
                        </div>
                        <div className='department-content-right'>
                            <div className="report-item">
                                <span>Đi muộn:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                            <div className="report-item">
                                <span>Nghỉ:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                        </div>
                    </div>

                    <div className="personnel-home-report-department">
                        <div className="department-name">Tổ Khoan</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa chính:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Tăng ca:</span> <span>2</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa phụ:</span> <span>1</span>
                            </div>
                        </div>
                        <div className='department-content-right'>
                            <div className="report-item">
                                <span>Đi muộn:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                            <div className="report-item">
                                <span>Nghỉ:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                        </div>
                    </div>

                    <div className="personnel-home-report-department">
                        <div className="department-name">Tổ Cường Lực</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa chính:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Tăng ca:</span> <span>2</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa phụ:</span> <span>1</span>
                            </div>
                        </div>
                        <div className='department-content-right'>
                            <div className="report-item">
                                <span>Đi muộn:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                            <div className="report-item">
                                <span>Nghỉ:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                        </div>
                    </div>

                    <div className="personnel-home-report-department">
                        <div className="department-name">Tổ Dán</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa chính:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Tăng ca:</span> <span>2</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa phụ:</span> <span>1</span>
                            </div>
                        </div>
                        <div className='department-content-right'>
                            <div className="report-item">
                                <span>Đi muộn:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                            <div className="report-item">
                                <span>Nghỉ:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                        </div>
                    </div>

                    <div className="personnel-home-report-department">
                        <div className="department-name">Tổ Hộp</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa chính:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Tăng ca:</span> <span>2</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa phụ:</span> <span>1</span>
                            </div>
                        </div>
                        <div className='department-content-right'>
                            <div className="report-item">
                                <span>Đi muộn:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                            <div className="report-item">
                                <span>Nghỉ:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                        </div>
                    </div>

                    <div className="personnel-home-report-department">
                        <div className="department-name">Tổ Giao Hàng</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa chính:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Tăng ca:</span> <span>2</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa phụ:</span> <span>1</span>
                            </div>
                        </div>
                        <div className='department-content-right'>
                            <div className="report-item">
                                <span>Đi muộn:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                            <div className="report-item">
                                <span>Nghỉ:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                        </div>
                    </div>

                    <div className="personnel-home-report-department">
                        <div className="department-name">Tổ EI</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa chính:</span> <span>5</span>
                            </div>
                            <div className="report-item">
                                <span>Tăng ca:</span> <span>2</span>
                            </div>
                            <div className="report-item">
                                <span>Bữa phụ:</span> <span>1</span>
                            </div>
                        </div>
                        <div className='department-content-right'>
                            <div className="report-item">
                                <span>Đi muộn:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                            <div className="report-item">
                                <span>Nghỉ:</span> <span>2</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Có phép:</span> <span>1</span>
                            </div>
                            <div className="report-sub-item">
                                <span>Không phép:</span> <span>1</span>
                            </div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PesonnelReportHome);
