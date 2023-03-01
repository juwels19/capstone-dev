
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
