import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

import { UserRepository } from '@app/repositories/UserRepository';
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository';

import { GroupsRepository } from '@app/repositories/GroupsRepository';
import { PrismaGroupRepository } from './prisma/repositories/prisma-group-repository';

import { QuestionsRepository } from '@app/repositories/QuestionsRepository';
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository';

import { QuestionOptionRepository } from '@app/repositories/QuestionOptionRepository';
import { PrismaQuestionOptionRepository } from './prisma/repositories/prisma-question-option-repository';

import { GameRepository } from '@app/repositories/GameRepository';
import { PrismaGameRepository } from './prisma/repositories/prisma-game-repository';

import { StudentPlayGameRepository } from '@app/repositories/StudentPlayGameRepository';
import { PrismaStudentPlayGameRepository } from './prisma/repositories/prisma-student-play-game-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: GroupsRepository,
      useClass: PrismaGroupRepository,
    },
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: QuestionOptionRepository,
      useClass: PrismaQuestionOptionRepository,
    },
    {
      provide: GameRepository,
      useClass: PrismaGameRepository,
    },
    {
      provide: StudentPlayGameRepository,
      useClass: PrismaStudentPlayGameRepository,
    },
  ],
  exports: [
    UserRepository,
    GroupsRepository,
    QuestionsRepository,
    QuestionOptionRepository,
    GameRepository,
    StudentPlayGameRepository,
  ],
})
export class DatabaseModule {}
