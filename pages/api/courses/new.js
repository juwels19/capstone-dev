import prisma from "@prisma/index"
import colours from "src/utils/colours";

// api/tasks/new
async function handler(req, res) {
    if (req.method === "POST") {
        const { courseName, userId } = JSON.parse(req.body);

        const newCourse = await prisma.course.create({
            data: {
                courseName,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        const updatedCourse = await prisma.course.update({
            where: {
                id: newCourse.id
            },
            data: {
                colourCode: colours[newCourse.id % colours.length]
            }
        })

        //Send success response
        res.status(201).json({ message: 'Course created', ...updatedCourse });
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Request not valid' });
    }
}

export default handler