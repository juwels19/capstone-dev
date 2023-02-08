import prisma from "@prisma/index"

// api/sessions/new
async function handler(req, res) {
    if (req.method === "POST") {
        const { userId, taskId, startDateTime, duration, productivityRating, notes } = JSON.parse(req.body);

        const newSession = await prisma.session.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                task: {
                    connect: {
                        id: taskId
                    }
                },
                startDateTime: startDateTime,
                duration: duration,
                productivityRating: productivityRating,
                notes: notes
            }
        })

        //Send success response
        res.status(201).json({ message: 'Working session created', body: newSession, ...newSession });
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Request not valid' });
    }
}

export default handler