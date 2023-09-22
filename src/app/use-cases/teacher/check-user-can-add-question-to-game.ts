import { GameRepository } from '@app/repositories/GameRepository';
import { Injectable } from '@nestjs/common';

interface CheckUserCanAddQuestionToGameRequest {
  game_id: string;
  user_id: string;
}

@Injectable()
export class CheckUserCanAddQuestionToGame {
  constructor(private gameRepository: GameRepository) {}

  async execute({ game_id, user_id }: CheckUserCanAddQuestionToGameRequest) {
    const game = await this.gameRepository.findById(game_id);
    const result: { error: null | string } = { error: null };

    if (!game || game.teacher_user_id !== user_id)
      result.error = 'Você não pode adicionar questões';

    if (game.winner_user_id) result.error = 'Esse jogo já foi finalizado';
    return result;
  }
}
