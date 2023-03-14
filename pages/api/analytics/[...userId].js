import prisma from "@prisma/index";

// api/analytics/[userID]
async function handler(req, res) {
    const { userId } = req.query;
    if (req.method === "GET") {
        // This is where all the data needs to be returned for the analytics page
        // Data for recharts needs to be in a list of dictionaries
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            },
            include: {
                courses: true,
                tasks: true,
                sessions: true
            }
        })

        // Average working session duration by course
        var avgSessionDurationByCourseData = []
        for (const course of user.courses) {
            var totalDuration = 0;
            var numSessionsInCourse = 0;
            const courseId = course.id;
            
            var taskIdsInCourse = {};
            for (const task of user.tasks) {
                if (task.courseId === courseId) {
                    taskIdsInCourse[task.id] = true
                }
            }

            for (const session of user.sessions) {
                if (taskIdsInCourse[session.taskId]) {
                    totalDuration += session.duration
                    numSessionsInCourse += 1
                }
            }

            var currentCourse = {
                courseName: course.courseName,
                averageDuration: numSessionsInCourse !== 0 ? (totalDuration / numSessionsInCourse).toFixed(1) : 0
            }
            avgSessionDurationByCourseData.push(currentCourse)
        }
        const body = {
            avgSessionDurationByCourseData: avgSessionDurationByCourseData
        }
        res.status(201).json({ message: 'Analytics fetch successful', body: body });
    } else {
        //Response for other than GET method
        res.status(500).json({ message: 'Request not valid' });
    }
}

export default handler