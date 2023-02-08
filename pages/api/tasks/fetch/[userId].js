import prisma from "@prisma/index"

// api/tasks/fetch/[userId]
async function handler(req, res) {
    const { userId } = req.query;
    if (req.method === "GET") {

        const fetchRes = await prisma.task.findMany({
            where: {
                user: {
                    is: {
                        id: parseInt(userId)
                    }
                }
            },
            include: {course: true}
        });
        res.status(201).json({ message: 'Task fetch complete', body: fetchRes, ...fetchRes});
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Request not valid' });
    }
}

export default handler