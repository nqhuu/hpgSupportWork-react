import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";

class MyDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
    };
  }

  handleDateChange = (date) => {
    if (date) {
      date.setHours(12, 0, 0, 0); // Tránh lỗi lệch ngày do múi giờ
      this.setState({ selectedDate: date });
    }
  };

  render() {
    return (
      <DatePicker
        selected={this.state.selectedDate}
        onChange={this.handleDateChange}
        dateFormat="dd/MM/yyyy"
        locale={vi}
        minDate={new Date()} // Không cho chọn ngày quá khứ
        showMonthDropdown
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={10}
        className="form-control"
      />
    );
  }
}

export default MyDatePicker;
