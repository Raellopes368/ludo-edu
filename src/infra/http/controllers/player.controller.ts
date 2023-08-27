import { StudentEnterTheGame } from '@app/use-cases/students/student-enter-the-game';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EnterInGameBody } from '../dtos/enter-in-game-body';
import { StudentPlayGameViewModel } from '../view-models/student-play-game-view-model';
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import { JWTReqPayload } from 'src/interfaces';

@Controller('games/enter')
export class PlayerController {
  constructor(private readonly studentEnterTheGame: StudentEnterTheGame) {}

  @Post()
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
}
