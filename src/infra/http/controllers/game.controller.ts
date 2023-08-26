import { CreateGames } from '@app/use-cases/teacher/create-games';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateGamesBody } from '../dtos/create-games-body';
import { GameViewModel } from '../view-models/game-view-model';
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import { JWTReqPayload } from 'src/interfaces';
import { AddQuestionsToGameBody } from '../dtos/add-questions-to-game-body';
import { AddQuestionsToGame } from '@app/use-cases/teacher/add-questions-to-game';

@Controller('games')
export class GameController {
  constructor(
    private readonly createGame: CreateGames,
    private addQuestionsToGame: AddQuestionsToGame,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateGamesBody, @Req() req: JWTReqPayload) {
    const { amount_games, game_level, group_id } = body;
    const { userId } = req.user;
    try {
      const { games } = await this.createGame.execute({
        amount_games,
        game_level,
        group_id,
        teacher_user_id: userId,
      });

      return {
        games: games.map((game) => GameViewModel.toHTTP(game)),
      };
    } catch (error: any) {
      throw new HttpException(
        'Não foi possível criar os jogos',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/questions')
  @UseGuards(JwtAuthGuard)
  async addQuestions(
    @Body() body: AddQuestionsToGameBody,
    @Req() req: JWTReqPayload,
  ) {
    const { game_id, questions_id } = body;
    const { userId: user_id } = req.user;
    try {
      const { game } = await this.addQuestionsToGame.execute({
        game_id,
        questions_id,
        user_id,
      });

      return {
        game: GameViewModel.toHTTP(game),
      };
    } catch (error: any) {
      throw new HttpException(
        error.response || 'Não foi possível adicionar essas questões',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
