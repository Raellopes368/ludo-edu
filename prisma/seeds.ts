import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function run() {
  await prisma.pieces.deleteMany();
  await prisma.userCheckOptions.deleteMany();
  await prisma.studentsPlayGames.deleteMany();
  await prisma.gamesHasQuestions.deleteMany();
  await prisma.groupsHasQuestions.deleteMany();
  await prisma.questionOptions.deleteMany();
  await prisma.questions.deleteMany();
  await prisma.games.deleteMany();
  await prisma.groups.deleteMany();
  await prisma.user.deleteMany();

  const userId1 = randomUUID();
  const userId2 = randomUUID();
  const userId3 = randomUUID();

  const password = await bcrypt.hash('123456', 10);

  await prisma.user.create({
    data: {
      email: 'teacher@gmail.com',
      name: 'Teacher',
      type: 1,
      user_id: userId1,
      password,
    },
  });

  await prisma.user.create({
    data: {
      email: 'student1@gmail.com',
      name: 'Student 1',
      type: 2,
      user_id: userId2,
      password,
    },
  });

  await prisma.user.create({
    data: {
      email: 'student2@gmail.com',
      name: 'Student 2',
      type: 2,
      user_id: userId3,
      password,
    },
  });

  const questions = Array.from({ length: 25 }).map((_, index) => ({
    content: `Pergunta número ${index + 1}`,
    level: 2,
    question_id: randomUUID(),
    user_id: userId1,
  }));

  const questionOptions = questions
    .map((question) =>
      Array.from({ length: 5 }).map((_, index) => ({
        content: `Opção número ${index + 1}`,
        points: index === 4 ? 6 : index,
        question_id: question.question_id,
        question_option_id: randomUUID(),
      })),
    )
    .reduce((acc, currentArray) => [...acc, ...currentArray], []);

  await prisma.questions.createMany({
    data: questions,
  });

  await prisma.questionOptions.createMany({
    data: questionOptions,
  });
  questions.forEach((question) => console.log(`"${question.question_id}",`));
}

run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
