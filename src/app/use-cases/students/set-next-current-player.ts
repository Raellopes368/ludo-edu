import { Game } from '@app/entities/game';
import { QuestionOptions } from '@app/entities/question/QuestionOption';
import { GameRepository } from '@app/repositories/GameRepository';
import { Injectable } from '@nestjs/common';
import { MAX_POINT } from '../system/move-piece';
import { SendWebsocketEvent } from '../system/send-websocket-event';

interface SetNextCurrentPlayerRequest {
  game: Game;
  questionOption: QuestionOptions;
}

@Injectable()
export class SetNextCurrentPlayer {
  constructor(
    private gameRepository: GameRepository,
    private sendWebsocketEvent: SendWebsocketEvent,
  ) {}
  async execute({ game, questionOption }: SetNextCurrentPlayerRequest) {
    if (questionOption.points === MAX_POINT) {
      this.sendWebsocketEvent.execute({
        room: game.id,
        event: 'current-player',
        data: {
          currentPlayer: game.current_player,
        },
      });
      return;
    }

    const playerPosition = game.current_player?.game_position;

    const nextPosition =
      playerPosition === game.players.length ? 1 : playerPosition + 1;
    const nextPlayer = game.players.find(
      (player) => player.game_position === nextPosition,
    );

    game.current_player_id = nextPlayer.id;

    this.sendWebsocketEvent.execute({
      room: game.id,
      event: 'current-player',
      data: {
        currentPlayer: nextPlayer,
      },
    });

    await this.gameRepository.update(game);
  }
}
