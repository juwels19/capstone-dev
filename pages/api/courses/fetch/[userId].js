import prisma from "@prisma/index"

// api/courses/fetch/[userId]
async function handler(req, res) {
    const { userId } = req.query;
    if (req.method === "GET") {

        const courses = await prisma.course.findMany({where: {userId: parseInt(userId)}})

        res.status(201).json({ message: 'Course fetch complete', body: courses});
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Request not valid' });
    }
}

export default handler