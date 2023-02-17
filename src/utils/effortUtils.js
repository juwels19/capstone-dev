export const calculateActualTimeAndEffort = (task) => {
    var totalDurationSeconds = 0;
    for (const session of task.sessions) {
        totalDurationSeconds += session.duration;
    }
    const durationHours = (totalDurationSeconds / 3600).toFixed(2);
    var effort = 1;

    if (durationHours >= 12) {
        effort = 13
    } else if (durationHours >= 6) {
        effort = 8
    } else if (durationHours >= 3) {
        effort = 5
    } else if (durationHours >= 1) {
        effort = 3
    } else if (durationHours >= 0.5) {
        effort = 2
    }

    return [totalDurationSeconds, effort];

}