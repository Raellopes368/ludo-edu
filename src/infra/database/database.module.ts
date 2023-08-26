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
  ],
  exports: [
    UserRepository,
    GroupsRepository,
    QuestionsRepository,
    QuestionOptionRepository,
  ],
})
export class DatabaseModule {}
