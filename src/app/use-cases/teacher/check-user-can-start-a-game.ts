import { Game } from '@app/entities/game';
import { StudentsPlayGames } from '@app/entities/studentsPlayGames';
import { Injectable } from '@nestjs/common';
import { MinimumGameLimit } from 'src/interfaces';

interface CheckUserCanStartAGameRequest {
  user_id: string;
  game: Game | null;
  player: StudentsPlayGames;
}

@Injectable()
export class CheckUserCanStartAGame {
  async execute({ game, user_id, player }: CheckUserCanStartAGameRequest) {
    if (!game || game.teacher_user_id !== user_id || !player)
      return { error: 'Você não pode iniciar esse jogo' };

    if (!!game.winner_user_id) return { error: 'Esse jogo já foi finalizado' };

    if (game.questions?.length < MinimumGameLimit.QUESTIONS)
      return {
        error: `Cadastre pelo menos ${MinimumGameLimit.QUESTIONS} questões nesse jogo`,
      };

    if (game.players?.length < MinimumGameLimit.PLAYERS)
      return {
        error: 'Número de jogadores inferior a 2',
      };

    return {
      error: null,
    };
  }
}
