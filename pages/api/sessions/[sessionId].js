import prisma from "@prisma/index"

async function handler(req, res) {
    // TODO: get userId from req body and verify that user is authorized to edit session

    const { sessionId } = req.query;
    if (req.method === "DELETE") {
        await prisma.session.delete({where: {id: parseInt(sessionId)}})
        res.status(201).json({ message: 'Session deleted successfully' });
    } else if (req.method === "POST") {
        // Task editing logic in here... The user will edit the information and click confirm in the modal
        const { userId, productivityRating, notes, location, startDateTime, duration } = JSON.parse(req.body);
        await prisma.session.update({
            where: {id: parseInt(sessionId)},
            data: {
                productivityRating: parseInt(productivityRating),
                notes: notes,
                location: location,
                startDateTime: startDateTime,
                duration: parseInt(duration)
            },
        })
        res.status(201).json({ message: 'Session edited successfully' });
    } else {
        //Response for other than DELETE, POST method
        res.status(500).json({ message: 'Request not valid' });
    }
}

export default handler