import moment from 'moment-timezone';


const determineDayAndNight = () => {
    let timeNow = moment(); // Lấy giờ, phút, giây
    // Lấy ngày hiện tại
    let today = moment().format('YYYY-MM-DD');
    let tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

    // Ca ngày: 07:00:00 - 17:00:00 (trong ngày hiện tại)
    let shiftDayStart = moment(`${today} 07:00:00`);
    let shiftDayEnd = moment(`${today} 18:59:00`);

    // Ca đêm: 17:00:00 (hôm nay) - 05:00:00 (ngày mai)
    let shiftNightStart = moment(`${today} 19:00:00`);
    let shiftNightEnd = moment(`${tomorrow} 06:59:00`);
    // timeNow.format('HH:mm:ss'); // Hiển thị thời gian hiện tại dạng chuỗi

    // console.log(timeNow.isBefore(NA)) // kiểm tra giờ hiện tại có nhỏ hơn NA không (timeNow < NA) ,nếu nhỏ hơn trả về true, lơn hơn trả về false
    // console.log(timeNow.isAfter(NA)) // kiểm tra giờ hiện tại có lớn hơn NA không (timeNow > NA) ,nếu lớn hơn trả về true, lơn nhỏ trả về false
    let dayView = '';
    if (timeNow.isAfter(shiftDayStart) && timeNow.isBefore(shiftDayEnd)) dayView = 'NA';
    if (timeNow.isAfter(shiftNightStart) && timeNow.isBefore(shiftNightEnd)) dayView = 'DE'
    let dataDay = {
        day: dayView
    }
    return dataDay
}

export default determineDayAndNight 