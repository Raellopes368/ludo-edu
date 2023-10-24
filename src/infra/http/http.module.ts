import { JwtService } from '@nestjs/jwt';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

import { DatabaseModule } from '@infra/database/database.module';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

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
import { ListGroups } from '@app/use-cases/teacher/list-groups';
import { ListGamesByTeacher } from '@app/use-cases/user/list-games-by-teacher';
import { ListGamesByGroup } from '@app/use-cases/user/list-games-by-group';
import { StartAGame } from '@app/use-cases/teacher/start-a-game';
import { CheckUserCanStartAGame } from '@app/use-cases/teacher/check-user-can-start-a-game';
import { GetQuestionToAnswer } from '@app/use-cases/students/get-question-to-answer';
import { CheckStudentCanGetAQuestionToAnswer } from '@app/use-cases/students/check-student-can-get-a-question-to-answer';
import { CheckUserCanAddQuestionsToGroup } from '@app/use-cases/teacher/check-user-can-add-questions-to-group';
import { AddQuestionsToGroup } from '@app/use-cases/teacher/add-questions-to-group';
import { ListQuestions } from '@app/use-cases/teacher/list-questions';
import { CheckUserCanAnswerQuestions } from '@app/use-cases/students/check-user-can-answer-question';
import { SetNextCurrentPlayer } from '@app/use-cases/students/set-next-current-player';
import { AnswerQuestions } from '@app/use-cases/students/answer-questions';
import { CreateAPiece } from '@app/use-cases/system/create-a-piece';
import { SendWebsocketEvent } from '@app/use-cases/system/send-websocket-event';
import { MovePiece } from '@app/use-cases/system/move-piece';
import { SocketGateway } from '@infra/websocket/socket.gateway';
import { SearchUsers } from '@app/use-cases/user/search-users';
import { GetGame } from '@app/use-cases/students/get-game';
import { GetUser } from '@app/use-cases/user/get-user';
import { GetQuestionComplete } from '@app/use-cases/teacher/get-question-complete';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      password: process.env.REDIS_PASSWORD,
      url: process.env.REDIS_HOST,
    }),
  ],
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
    ListGroups,
    ListGamesByTeacher,
    ListGamesByGroup,
    StartAGame,
    CheckUserCanStartAGame,
    GetQuestionToAnswer,
    CheckStudentCanGetAQuestionToAnswer,
    CheckUserCanAddQuestionsToGroup,
    AddQuestionsToGroup,
    ListQuestions,
    CheckUserCanAnswerQuestions,
    SetNextCurrentPlayer,
    AnswerQuestions,
    CreateAPiece,
    SendWebsocketEvent,
    MovePiece,
    SocketGateway,
    SearchUsers,
    GetGame,
    GetUser,
    GetQuestionComplete,
  ],
})
export class HttpModule {}
