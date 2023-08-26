import { JwtService } from '@nestjs/jwt';

import { DatabaseModule } from '@infra/database/database.module';
import { Module } from '@nestjs/common';

import { CreateAuth } from '@app/use-cases/auth/create-auth';
import { AuthController } from './controllers/auth.controller';

import { CreateUser } from '@app/use-cases/user/create-user';
import { UserController } from './controllers/user.controller';

import { CreateGroups } from '@app/use-cases/teacher/create-groups';
import { CheckUserCanCreateAGroup } from '@app/use-cases/teacher/check-user-can-create-a-group';
import { GroupController } from './controllers/group.controller';

import { QuestionController } from './controllers/question.controller';
import { CreateQuestion } from '@app/use-cases/teacher/create-questions';
import { CheckUserCanCreateQuestionOptions } from '@app/use-cases/teacher/check-user-can-create-question-options';
import { CreateQuestionOptions } from '@app/use-cases/teacher/create-question-options';
import { QuestionOptionController } from './controllers/question-option.controller';
import { CreateGames } from '@app/use-cases/teacher/create-games';
import { GameController } from './controllers/game.controller';

import { CheckUserCanAddQuestionToGame } from '@app/use-cases/teacher/check-user-can-add-question-to-game';
import { AddQuestionsToGame } from '@app/use-cases/teacher/add-questions-to-game';

@Module({
  imports: [DatabaseModule],
  controllers: [
    UserController,
    AuthController,
    GroupController,
    QuestionController,
    QuestionOptionController,
    GameController,
  ],
  providers: [
    CreateUser,
    CreateAuth,
    JwtService,
    CreateGroups,
    CheckUserCanCreateAGroup,
    CreateQuestion,
    CheckUserCanCreateQuestionOptions,
    CreateQuestionOptions,
    CreateGames,
    CheckUserCanAddQuestionToGame,
    AddQuestionsToGame,
  ],
})
export class HttpModule {}
