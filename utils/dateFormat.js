const addDateSuffix = (date) => {
    let dateStr = date.toString();

    const lastChar = dateStr.charAt(dateStr.length -1);

    if (lastChar === '1' && dateStr !== '11') {
        dateStr = `${dateStr}st`;
    } else if (lastChar === '2' && dateStr !== '12') {
        dateStr =  `${dateStr}nd`;
    } else if (lastChar === '3' && dateStr !== '13') {
        dateStr =  `${dateStr}rd`;
    } else {
        dateStr = `${dateStr}th`;
    }

    return dateStr;

};

module.exports = (
    timeStamp,
    { monthLenth = 'short', dateSuffix = true } ={}
) => {
    const months = {
        0: monthLenth === 'short' ? 'Jan' : 'January',
        1: monthLenth === 'short' ? 'Feb' : 'February',
        2: monthLenth === 'short' ? 'Mar' : 'March',
        3: monthLenth === 'short' ? 'Apr' : 'April',
        4: monthLenth === 'short' ? 'May' : 'May',
        5: monthLenth === 'short' ? 'Jun' : 'June',
        6: monthLenth === 'short' ? 'Jul' : 'July',
        7: monthLenth === 'short' ? 'Aug' : 'August',
        8: monthLenth === 'short' ? 'Sep' : 'September',
        9: monthLenth === 'short' ? 'Oct' : 'October',
        10: monthLenth === 'short' ? 'Nov' : 'November',
        11: monthLenth === 'short' ? 'Dec' : 'December',
    };

    const dateObj = new Date (timestamp);
    const formattedMonth = months[dateObj.getMonth()];

    const dayOfMonth = dateSuffix
    ? addDateSuffix(dateObj.getDate())
    : dateObj.getDate();

    const year = dateObj.getFullYear();
    let hour =
      dateObj.getHours() > 12
    ? Math.floor(dateObj.getHours() - 12)
    : dateObj.getHours();

    if (hour === 0) {
        hour = 12;
    }

    const minutes = (dateObj.getMinutes() < 10 ? '0' : '') + dateObj.getMinutes();

    const periodOfDay = dateObj.getHours() >= 12 ? 'pm' : 'am';

    const formattedTimeStamp = `${formattedMonth} ${dayOfMonth}, ${year} at ${hour}:${minutes} ${periodOfDay}`;

    return formattedTimeStamp;

};

