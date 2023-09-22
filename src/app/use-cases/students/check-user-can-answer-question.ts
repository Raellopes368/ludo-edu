import { Game } from '@app/entities/game';
import { Injectable } from '@nestjs/common';

interface CheckUserCanAnswerQuestionsRequest {
  player_id: string;
  game: Game;
}

@Injectable()
export class CheckUserCanAnswerQuestions {
  async execute({ game, player_id }: CheckUserCanAnswerQuestionsRequest) {
    if (!game || !game?.is_started) return 'Erro ao responder questão';
    if (game.current_player_id !== player_id) return 'Ainda não é sua vez';
    return null;
  }
}
