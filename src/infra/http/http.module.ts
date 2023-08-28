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

import { StudentEnterTheGame } from '@app/use-cases/students/student-enter-the-game';
import { CheckUserCanJoinTheGame } from '@app/use-cases/students/check-user-can-join-the-game';
import { GetPlayerPositions } from '@app/use-cases/students/get-player-positions';
import { PlayerController } from './controllers/player.controller';
import { StudentJoinsAGroup } from '@app/use-cases/students/student-joins-a-group';

@Module({
  imports: [DatabaseModule],
  controllers: [
    UserController,
    AuthController,
    GroupController,
    QuestionController,
    QuestionOptionController,
    GameController,
    PlayerController,
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
    StudentEnterTheGame,
    CheckUserCanJoinTheGame,
    GetPlayerPositions,
    StudentJoinsAGroup,
  ],
})
export class HttpModule {}
