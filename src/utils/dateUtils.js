import moment from "moment";

export const calculateDateDifference = (dueDate) => {
    const msInDay = 86400000;
    let currDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    // Convert the due date string to milliseconds for comparison
    let dueDateNumeric = new Date(dueDate)
    const diff = dueDateNumeric - currDate;
    if (diff >= 0) {
        // Due date is more than a day in the future
        const daysAway = Math.ceil(diff / msInDay);
        if (daysAway > 1) {
            return `(in ${daysAway} days)`;
        } else {
            return `(tomorrow)`;
        }
    } else {
        const daysAgo = Math.abs(Math.ceil(diff / msInDay));
        if (daysAgo > 1) {
            return `(${daysAgo} days ago)`
        } else if (daysAgo == 1) {
            return `(yesterday)`
        }else {
            return `(today)`
        }
    }

}

export const getHMSfromDuration = (durationSeconds) => {
    const totalMinutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return [hours, minutes, seconds]
}

export const getTimeDisplay = (hours, minutes, seconds) => {
    return (
        hours ? `${hours.toFixed(0)}h ${minutes.toFixed(0)}m` : 
        minutes ? `${minutes.toFixed(0)}m` :
        seconds ? `${seconds.toFixed(0)}s` : "-"
    )
}

export const setDateToMonday = ( date ) => {
    const dateMoment = moment(date)
    return dateMoment.startOf('isoWeek')
    // var day = date.getDay() || 7;  
    // if( day !== 1 ) 
    //     date.setHours(-24 * (day - 1)); 
    // return date;
}


export const isDueDateClose = (date) => {
    return moment(moment().format()).isBetween(moment(date).subtract(2, "days"), date)
}