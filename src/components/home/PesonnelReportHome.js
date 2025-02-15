import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../redux/actions/actionTypes";
import './PesonnelReportHome.scss'
import moment from 'moment'


import { getAllPersonnelReport } from '../../services/HrService'



class PesonnelReportHome extends Component {

    state = {


    }

    componentDidMount = async () => {
        let timeNow = moment(); // Lấy giờ, phút, giây
        // Lấy ngày hiện tại
        let today = moment().format('YYYY-MM-DD');
        let tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

        // Ca ngày: 07:00:00 - 17:00:00 (trong ngày hiện tại)
        let shiftDayStart = moment(`${today} 07:00:00`);
        let shiftDayEnd = moment(`${today} 17:00:00`);

        // Ca đêm: 17:00:00 (hôm nay) - 05:00:00 (ngày mai)
        let shiftNightStart = moment(`${today} 19:00:00`);
        let shiftNightEnd = moment(`${tomorrow} 05:00:00`);
        // timeNow.format('HH:mm:ss'); // Hiển thị thời gian hiện tại dạng chuỗi

        // let NA = moment('16:59:59', 'HH:mm:ss'); // Ngày
        // let DE = moment('17:59:59', 'HH:mm:ss'); // Đêm

        // console.log(timeNow.isBefore(NA)) // kiểm tra giờ hiện tại có nhỏ hơn NA không (timeNow < NA) ,nếu nhỏ hơn trả về true, lơn hơn trả về false
        // console.log(timeNow.isAfter(NA)) // kiểm tra giờ hiện tại có lớn hơn NA không (timeNow > NA) ,nếu lớn hơn trả về true, lơn nhỏ trả về false
        let dayView = '';
        if (timeNow.isAfter(shiftDayStart) && timeNow.isBefore(shiftDayEnd)) dayView = 'NA';
        if (timeNow.isAfter(shiftNightStart) && timeNow.isBefore(shiftNightEnd)) dayView = 'DE'
        let dataDay = {
            day: dayView
        }
        let allReport = await getAllPersonnelReport({ day: dataDay.day })
        console.log('allReport', allReport)
    };

    componentDidUpdate = async (prevProps, prevState, snapshot) => {

    };

    render() {
        return (
            <>
                <div className="personnel-home-container">
                    <div className="personnel-home-report-department">
                        <div className="department-name">Tổ Cắt</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                        <div className="department-name">Kinh doanh</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                        <div className="department-name">Đơn hàng</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                        <div className="department-name">Kế toán</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                        <div className="department-name">HCNS</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
                        <div className="department-name">Mua hàng</div>
                        <div className='department-content-left'>
                            <div className="report-item">
                                <span>Tổng đi làm:</span> <span>5/7</span>
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
