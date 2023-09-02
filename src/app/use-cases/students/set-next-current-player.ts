import { Game } from '@app/entities/game';
import { QuestionOptions } from '@app/entities/question/QuestionOption';
import { GameRepository } from '@app/repositories/GameRepository';
import { Injectable } from '@nestjs/common';

interface SetNextCurrentPlayerRequest {
  game: Game;
  questionOption: QuestionOptions;
}

@Injectable()
export class SetNextCurrentPlayer {
  constructor(private gameRepository: GameRepository) {}
  async execute({ game, questionOption }: SetNextCurrentPlayerRequest) {
    if (questionOption.points === 6) {
      // envia websocket para o mesmo jogador
      return;
    }

    const playerPosition = game.current_player?.game_position;
    const nextPosition =
      playerPosition === game.players.length ? 1 : playerPosition + 1;

    const nextPlayer = game.players.find(
      (player) => player.game_position === nextPosition,
    );

    game.current_player_id = nextPlayer.player_user_id;

    // envia websocket para o próximo jogador

    await this.gameRepository.update(game);
  }
}
