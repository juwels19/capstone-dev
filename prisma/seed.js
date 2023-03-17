const { PrismaClient } = require('@prisma/client')
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
    const USERS = ['Grace', 'Lamar', 'Alexander', 'Tom', 'Andre']

    const DATA = await Promise.all(USERS.map(async (name) => {
        return  {
            firstName: name,
            email: `${name.toLowerCase()}@capstone.com`,
            password: await bcrypt.hash("password", 12),
            courses: [
                {
                    courseName: "CALC 204",
                    colourCode: "#00385B",
                    tasks: [
                        {
                            dueDate: "2023-03-18",
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
                                    startDateTime: "Sat Mar 11 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1300,
                                    productivityRating: 3,
                                    location: "Library",
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
                                    startDateTime: "Sun Mar 12 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1400,
                                    productivityRating: 3,
                                    location: "Library",
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
                            dueDate: "2023-03-11",
                            taskName: "Calculus Assignment #1",
                            effortRating: 3,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Thu Mar 02 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1215,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Sun Mar 05 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1400,
                                    productivityRating: 3,
                                    location: "Library",
                                },
                                {
                                    startDateTime: "Fri Mar 10 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 1800,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Tues Feb 28 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        }
                    ],
                }, 
                {
                    courseName: "ENGL 302",
                    colourCode: "#620000", 
                    tasks: [
                        {
                            dueDate: "2023-02-17",
                            taskName: "Writing Prompt 1",
                            effortRating: 2,
                            completed: true,
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
                                {
                                    startDateTime: "Sun Mar 12 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1579,
                                    productivityRating: 3,
                                    location: "Library",
                                },
                            ],
                            createdAt: "Tues Feb 14 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        },
                        {
                            dueDate: "2023-03-03",
                            taskName: "Writing Prompt 2",
                            effortRating: 2,
                            completed: true,
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
                                {
                                    startDateTime: "Sun Mar 12 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 400,
                                    productivityRating: 3,
                                    location: "Library",
                                },
                            ],
                            createdAt: "Tues Feb 21 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        },
                        {
                            dueDate: "2023-03-17",
                            taskName: "Writing Prompt 3",
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
                                {
                                    startDateTime: "Sun Mar 12 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 400,
                                    productivityRating: 3,
                                    location: "Library",
                                },
                            ],
                            createdAt: "Tues Mar 07 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        }
                    ],
                },
                {
                    courseName: "BIO 112",
                    colourCode: "#6A4D08",
                    tasks: [
                        {
                            dueDate: "2023-03-20",
                            taskName: "Chapter 3 Texbook Notes", 
                            effortRating: 3,
                            completed: false,
                            sessions: [
                                {
                                    startDateTime: "Thu Mar 16 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 6622,
                                    productivityRating: 1,
                                    location: "Library",
                                },
                                {
                                    startDateTime: "Fri Mar 17 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 141,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Thu Mar 16 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        },
                        {
                            dueDate: "2023-03-20",
                            taskName: "Biology Lab Report", 
                            effortRating: 3,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Sun Mar 12 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 6622,
                                    productivityRating: 1,
                                    location: "Library",
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
                            dueDate: "2023-03-21",
                            taskName: "Biology Midterm", 
                            effortRating: 8,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Sun Mar 12 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 6622,
                                    productivityRating: 1,
                                    location: "Library",
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
                            dueDate: "2023-03-17",
                            taskName: "Biology Discussion Post", 
                            effortRating: 1,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Mon Mar 13 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 100,
                                    productivityRating: 1,
                                    location: "Library",
                                },
                                {
                                    startDateTime: "Thu Mar 16 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 800,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Mon Mar 13 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
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
                        },
                        {
                            dueDate: "2023-02-28",
                            taskName: "Physics Quiz",
                            effortRating: 3,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Fri Feb 24 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 6622,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Sat Feb 25 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 141,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Mon Feb 20 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        },
                        {
                            dueDate: "2023-02-28",
                            taskName: "Physics Discussion Post 1",
                            effortRating: 1,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Mon Feb 27 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 1969,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Mon Feb 27 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        },
                        {
                            dueDate: "2023-02-13",
                            taskName: "Physics Discussion Post 0",
                            effortRating: 1,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Sun Feb 12 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 400,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Sun Feb 12 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
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
                        },
                        {
                            dueDate: "2023-03-06",
                            taskName: "Chemistry Quiz 2",
                            effortRating: 5,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Sat Mar 04 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1215,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Sat Mar 04 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1300,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Sun Mar 05 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 141,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Fri Mar 03 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        },
                        {
                            dueDate: "2023-02-24",
                            taskName: "Chemistry Quiz 1",
                            effortRating: 5,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Mon Feb 20 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 5812,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Wed Feb 22 2023 16:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 4184,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Thu Feb 23 2023 12:16:23 GMT-0500 (Eastern Standard Time)",
                                    duration: 3655,
                                    productivityRating: 2,
                                    location: "In-Class",
                                },
                            ],
                            createdAt: "Sun Feb 19 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        }
                    ],
                },
                {
                    courseName: "PHYS 431",
                    colourCode: "#2B3142",
                    tasks: [
                        {
                            dueDate: "2023-03-06",
                            taskName: "Textbook Chapter 1 Reading",
                            effortRating: 2,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Sun Mar 05 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1215,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                            ],
                            createdAt: "Tues Mar 07 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        },
                        {
                            dueDate: "2023-03-12",
                            taskName: "Textbook Chapter 2 Reading",
                            effortRating: 1,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Wed Mar 08 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1000,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                            ],
                            createdAt: "Tues Mar 07 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        },
                        {
                            dueDate: "2023-03-11",
                            taskName: "Midterm Studying",
                            effortRating: 2,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Wed Mar 08 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 1000,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Thurs Mar 09 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 4000,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                            ],
                            createdAt: "Fri Mar 10 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        },
                        {
                            dueDate: "2023-03-09",
                            taskName: "Problem Set 4",
                            effortRating: 1,
                            completed: true,
                            sessions: [
                                {
                                    startDateTime: "Wed Mar 08 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 546,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                                {
                                    startDateTime: "Thurs Mar 08 2023 15:10:34 GMT-0500 (Eastern Standard Time)",
                                    duration: 7499,
                                    productivityRating: 1,
                                    location: "Home",
                                },
                            ],
                            createdAt: "Fri Mar 10 2023 15:10:34 GMT-0500 (Eastern Standard Time)"
                        }
                    ],
                },
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
                        completed: task.completed,
                        createdAt: task.createdAt,
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