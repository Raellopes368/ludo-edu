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

@Controller('games')
export class GameController {
  constructor(private readonly createGame: CreateGames) {}

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
}
