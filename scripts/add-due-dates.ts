import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tasksToUpdate = await prisma.task.findMany({
    where: {
      dueDate: null,
    },
  });

  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  for (const task of tasksToUpdate) {
    await prisma.task.update({
      where: { id: task.id },
      data: { dueDate: oneWeekFromNow },
    });
  }

  console.log(`Updated ${tasksToUpdate.length} tasks with a new due date.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
