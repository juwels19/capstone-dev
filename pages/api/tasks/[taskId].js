import prisma from "@prisma/index"

// api/tasks/[taskId]
async function handler(req, res) {
    const { taskId } = req.query;
    if (req.method === "DELETE") {
        // Task delete logic in here... This will only be called if the user confirms the deletion
        await prisma.task.delete({where: {id: parseInt(taskId)}})
        //Send success response
        res.status(201).json({ message: 'Task deleted successfully' });
    } else if (req.method === "POST") {
        // Task editing logic in here... The user will edit the information and click confirm in the modal
        const { userId, taskName, courseSelected, effortRating, dueDate, completed} = JSON.parse(req.body);        
        const findCourseRes = courseSelected ? await prisma.course.findFirst({where: {courseName: courseSelected, userId: userId}}) : undefined

        const taskCreateRes = await prisma.task.update({
            where: {id: parseInt(taskId)},
            data: {
                course: findCourseRes ? {
                    connect: {
                        id: findCourseRes.id 
                    }
                } : undefined,
                taskName: taskName,
                dueDate: dueDate,
                effortRating: effortRating ? parseInt(effortRating) : undefined,
                completed: completed
            }
        })
        res.status(201).json({ message: 'Task edited successfully' });
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Request not valid' });
    }
}

export default handler