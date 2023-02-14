
export default function calculateDateDifference(dueDate) {
    const msInDay = 86400000;
    let currDate = Date.now()
    // Convert the due date string to milliseconds for comparison
    let dueDateNumeric = Date.parse(dueDate)
    const diff = dueDateNumeric - currDate;
    if (diff >= 0) {
        // Due date is more than a day in the future
        const daysAway = Math.floor(diff / msInDay);
        if (daysAway > 1) {
            return `(due in ${daysAway} days)`;
        } else {
            return `(due in ${daysAway} day)`;
        }
    } else {
        const daysAgo = Math.abs(Math.floor(diff / msInDay)) - 1;
        if (daysAgo > 1) {
            return `(was due ${daysAgo} days ago)`
        } else {
            return `(was due ${daysAgo} day ago)`
        }
    }

}