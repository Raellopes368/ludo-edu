import { GameRepository } from '@app/repositories/GameRepository';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SendWebsocketEvent } from '../system/send-websocket-event';
import { SocketGateway } from '@infra/websocket/socket.gateway';
import { StudentPlayGameRepository } from '@app/repositories/StudentPlayGameRepository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface GetGameRequest {
  user_id: string;
  game_id: string;
}

@Injectable()
export class GetGame {
  constructor(
    private gameRepository: GameRepository,
    private studentPlayGame: StudentPlayGameRepository,
    private sendWebsocketEvent: SendWebsocketEvent,
    private socketGateway: SocketGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute({ game_id, user_id }: GetGameRequest) {
    const [game, player] = await Promise.all([
      this.gameRepository.findById(game_id),
      this.studentPlayGame.findByUserIdAndGame(user_id, game_id),
    ]);

    if (!game || !player)
      throw new HttpException(
        'Houve um erro ao buscar esse jogo',
        HttpStatus.BAD_GATEWAY,
      );

    const websocketClientId = await this.cacheManager.get<string>(user_id);

    await this.cacheManager.set(`game-${user_id}`, game_id);
    const client = this.socketGateway.getClientById(websocketClientId);

    if (client) {
      client.join(game_id);
    }

    this.sendWebsocketEvent.execute({
      room: game_id,
      event: 'join-game',
      data: {
        player,
      },
    });

    game.questions = [];

    return {
      game,
    };
  }
}
