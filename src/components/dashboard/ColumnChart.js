import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../redux/actions/actionTypes";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Text } from "recharts";

const data = [
    // { month: "Th.1", total: 100, completed: 80, pending: 20 },
    // { month: "Th.2", total: 120, completed: 90, pending: 30 },
    // { month: "Th.3", total: 90, completed: 70, pending: 20 },
    { month: "Th.4", total: 150, completed: 120, pending: 30 },
    { month: "Th.5", total: 130, completed: 100, pending: 30 },
    { month: "Th.6", total: 110, completed: 90, pending: 20 },
];


class ColumnChart extends Component {

    state = {

    }



    render() {
        const displayData = data.length > 0 ? data : [{ month: "Không có dữ liệu", total: 0, completed: 0, pending: 0 }];

        return (
            <div style={{ width: "100%", height: 400, position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#8884d8" name="Tổng" />
                        <Bar dataKey="completed" fill="#82ca9d" name="Hoàn thành" />
                        <Bar dataKey="pending" fill="#ff7300" name="Tồn đọng" />
                        {/* Hiển thị text "Không có dữ liệu" khi data rỗng */}
                        {data.length === 0 && (
                            <text x="55%" y="50%" textAnchor="middle" fill="#ccc" fontSize={16}>
                                Thiết bị ổn định
                            </text>
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ColumnChart);
