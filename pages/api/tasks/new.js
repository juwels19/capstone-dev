import prisma from "@prisma/index"

// api/tasks/new
async function handler(req, res) {
    if (req.method === "POST") {

        const { taskName, courseName, effort, dueDate, userId } = JSON.parse(req.body);

        // Find the course if it's passed - course names are unique to the user
        const findCourseRes = await prisma.course.findFirst({where: {courseName: courseName.value, userId: userId}})

        // Create the task
        const taskCreateRes = await prisma.task.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                course: {
                    connect: {
                        id: findCourseRes.id
                    }
                },
                taskName: taskName,
                dueDate: dueDate,
                effortRating: effort
            }
        })
        //Send success response
        res.status(201).json({ message: 'Task created', body: taskCreateRes, ...taskCreateRes });
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Request not valid' });
    }
}

export default handler