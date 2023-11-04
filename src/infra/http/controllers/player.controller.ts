import { AnswerQuestions } from '@app/use-cases/students/answer-questions';
import { StudentEnterTheGame } from '@app/use-cases/students/student-enter-the-game';
import { StudentJoinsAGroup } from '@app/use-cases/students/student-joins-a-group';
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JWTReqPayload } from 'src/interfaces';
import { AnswerQuestionBody } from '../dtos/answer-question-body';
import { EnterInGameBody } from '../dtos/enter-in-game-body';
import { JoinAGroupBody } from '../dtos/join-a-group-body';
import { StudentPlayGameViewModel } from '../view-models/student-play-game-view-model';
import { UserViewModel } from '../view-models/user-view-model';
import { GetGame } from '@app/use-cases/students/get-game';
import { GameViewModel } from '../view-models/game-view-model';

@Controller('players')
export class PlayerController {
  constructor(
    private readonly studentEnterTheGame: StudentEnterTheGame,
    private studentJoinAGroup: StudentJoinsAGroup,
    private answerQuestion: AnswerQuestions,
    private getGame: GetGame,
  ) {}

  @Post('/join')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() { game_id }: EnterInGameBody,
    @Req() req: JWTReqPayload,
  ) {
    const { userId } = req.user;
    try {
      const { player } = await this.studentEnterTheGame.execute({
        game_id,
        player_user_id: userId,
      });

      return {
        player: StudentPlayGameViewModel.toHTTP(player),
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi possível entrar no jogo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/groups/join')
  async joinGroup(@Body() body: JoinAGroupBody, @Req() req: JWTReqPayload) {
    const { userId: user_id } = req.user;
    const { group_id } = body;
    try {
      const { user } = await this.studentJoinAGroup.execute({
        group_id,
        user_id,
      });

      return {
        user: UserViewModel.toHTTP(user),
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi possível entrar no grupo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/answer/questions')
  @UseGuards(JwtAuthGuard)
  async answer(@Body() body: AnswerQuestionBody, @Req() req: JWTReqPayload) {
    const { userId: user_id } = req.user;
    try {
      const { points } = await this.answerQuestion.execute({
        ...body,
        user_id,
      });

      return {
        points,
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi responder a pergunta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/game/:game_id')
  async getAGame(
    @Param() { game_id }: { game_id: string },
    @Req() req: JWTReqPayload,
  ) {
    try {
      const { userId: user_id } = req.user;
      const { game } = await this.getGame.execute({
        game_id,
        user_id,
      });

      return {
        game: GameViewModel.toHTTP(game),
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Houve um erro ao retornar dados',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
