import prisma from "@prisma/index"

// api/sessions/fetch/[taskId]
async function handler(req, res) {
    const { taskId } = req.query;
    if (req.method === "GET") {

        const fetchRes = await prisma.session.findMany({
            where: {
                task: {
                    is: {
                        id: parseInt(taskId)
                    }
                }
            },
            orderBy: [
                {
                    id: 'desc'
                }
            ]
        });
        res.status(201).json({ message: 'Session fetch complete', body: fetchRes, ...fetchRes});
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Request not valid' });
    }
}

export default handler