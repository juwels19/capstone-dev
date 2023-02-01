import prisma from "@prisma/index"

// api/tasks/new
async function handler(req, res) {
    if (req.method === "POST") {

        //Send success response
        res.status(201).json({ message: 'Task created', ...status });
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Request not valid' });
    }
}