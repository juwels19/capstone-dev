export const calculateActualTimeAndEffort = (task) => {
    var totalDurationSeconds = 0;
    for (const session of task.sessions) {
        totalDurationSeconds += session.duration;
    }
    const durationHours = (totalDurationSeconds / 3600).toFixed(2);

    const effort = durationHoursToEffort(durationHours)

    return [totalDurationSeconds, effort];

}

export const durationHoursToEffort = (durationHours) => {
    if (durationHours >= 12) {
        return 13
    } else if (durationHours >= 6) {
        return 8
    } else if (durationHours >= 3) {
        return 5
    } else if (durationHours >= 1) {
        return 3
    } else if (durationHours >= 0.5) {
        return 2
    } else { 
        return 1
    }
}