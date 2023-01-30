const { PrismaClient }  = require("@prisma/client");

// import prisma from prisma/index.ts
const prisma = new PrismaClient();

export async function queryTasks() {
    return await prisma.task.findMany();
}

queryTasks()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })