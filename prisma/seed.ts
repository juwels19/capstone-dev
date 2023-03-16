import prisma from "./index";
import { hash } from "bcryptjs"

async function main() {
    const USERS = ['Grace', 'Lamar', 'Alexander', 'Thomas', 'Andres']

    const DATA = await Promise.all(USERS.map(async (name) => {
        return  {
            firstName: name,
            email: `${name.toLowerCase()}@capstone.com`,
            password: await hash("password", 12),
            courses: [
                {
                    courseName: "CALC 204",
                    colourCode: "#00385B",
                    tasks: [
                        {
                            dueDate: "2023-03-24",
                            taskName: "Calculus Assignment #2",
                            effortRating: 3,
                            completed: false,
                            sessions: [
                                {
                                    startDateTime: "Thu Mar 09 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1215,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Fri Mar 10 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 141,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Tues Mar 07 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        },
                        {
                            dueDate: "2023-03-31",
                            taskName: "Calculus Assignment #3",
                            effortRating: 3,
                            completed: false,
                            sessions: [
                                {
                                    startDateTime: "Thu Mar 09 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1215,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Fri Mar 10 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 141,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Tues Mar 07 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        }
                    ],
                }, 
                {
                    courseName: "ENGL 302",
                    colourCode: "#112531", 
                    tasks: [
                        {
                            dueDate: "2023-03-17",
                            taskName: "Writing prompt",
                            effortRating: 2,
                            completed: false,
                            sessions: [
                                {
                                    startDateTime: "Thu Mar 09 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1215,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Fri Mar 10 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 141,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Tues Mar 07 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        }
                    ],
                },
                {
                    courseName: "BIO 112",
                    colourCode: "#020F18",
                    tasks: [
                        {
                            dueDate: "2023-03-20",
                            taskName: "Biology Lab Report", 
                            effortRating:5,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Fri Mar 12 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 6622,
                                    productivityRating: 1,
                                    location: "Library",
                                },
                            ],
                            createdAt: "Tues Mar 07 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        }
                    ],
                },
                {
                    courseName: "PHYS 432",
                    colourCode: "#003EE7",
                    tasks: [
                        {
                            dueDate: "2023-04-07",
                            taskName: "Physics Homework #1",
                            effortRating: 5,
                            completed: false,
                            sessions: [
                                {
                                    startDateTime: "Thu Mar 09 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1215,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Fri Mar 10 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 141,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Tues Mar 07 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        }
                    ],
                },
                {
                    courseName: "CHEM 134",
                    colourCode: "#02288E",
                    tasks: [
                        {
                            dueDate: "2023-04-14",
                            taskName: "Chemistry Midterm",
                            effortRating: 8,
                            completed: false,
                            sessions: [
                                {
                                    startDateTime: "Thu Mar 09 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1215,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Fri Mar 10 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 141,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Tues Mar 07 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        }
                    ],
                },
                {
                    courseName: "PHYS 431",
                    colourCode: "#2B3142",
                    tasks: [
                        {
                            dueDate: "2023-04-07",
                            taskName: "Physics Lab #1",
                            effortRating: 5,
                            completed: false,
                            sessions: [
                                {
                                    startDateTime: "Thu Mar 09 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1215,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Fri Mar 10 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 141,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Tues Mar 07 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        }
                    ],
                }
            ]
        }
    }))

    for (const user of DATA) {
        const {firstName, email, password, courses} = user

        const createdUser = await prisma.user.upsert({
            where: { email: email},
            update: {
                password: password,
                firstName: firstName,
            },
            create: {
                email: email,
                password: password,
                firstName: firstName,
            },
        })

        // Clear courses, tasks & sessions associated with test users
        await prisma.course.deleteMany({where: {userId: createdUser.id}})
        await prisma.task.deleteMany({where: {userId: createdUser.id}})
        await prisma.session.deleteMany({where: {userId: createdUser.id}})

        for (const course of courses) {
            const createdCourse = await prisma.course.create({
                data: {
                    courseName: course.courseName,
                    colourCode: course.colourCode,
                    userId: createdUser.id,
                }
            })

            for (const task of course.tasks) {
                const createdTask = await prisma.task.create({
                    data: {
                        taskName: task.taskName,
                        dueDate: task.dueDate,
                        effortRating: task.effortRating,
                        userId: createdUser.id,
                        courseId: createdCourse.id,
                        completed: task.completed
                    }
                })

                for (const session of task.sessions) {
                    await prisma.session.create({
                        data: {
                            userId: createdUser.id,
                            taskId: createdTask.id,
                            ...session
                        }
                    })
                }

            }
        }
    }
}

main()
  .then(async () => {
    console.log("db seeded successfully 🌱")
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })