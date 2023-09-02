import { AnswerQuestions } from '@app/use-cases/students/answer-questions';
import { StudentEnterTheGame } from '@app/use-cases/students/student-enter-the-game';
import { StudentJoinsAGroup } from '@app/use-cases/students/student-joins-a-group';
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
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

@Controller('players')
export class PlayerController {
  constructor(
    private readonly studentEnterTheGame: StudentEnterTheGame,
    private studentJoinAGroup: StudentJoinsAGroup,
    private answerQuestion: AnswerQuestions,
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
      throw new HttpException(
        error.response || 'Não foi possível entrar no jogo',
        HttpStatus.BAD_REQUEST,
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
      throw new HttpException(
        error.response || 'Não foi possível entrar no grupo',
        HttpStatus.BAD_REQUEST,
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
      throw new HttpException(
        error.response || 'Não foi responder a pergunta',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
