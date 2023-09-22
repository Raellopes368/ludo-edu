import { StudentsPlayGames } from '@app/entities/studentsPlayGames';
import { StudentPlayGameRepository } from '@app/repositories/StudentPlayGameRepository';
import { SocketGateway } from '@infra/websocket/socket.gateway';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateAPiece } from '../system/create-a-piece';
import { SendWebsocketEvent } from '../system/send-websocket-event';
import { CheckUserCanJoinTheGame } from './check-user-can-join-the-game';
import { GetPlayerPositions } from './get-player-positions';

interface StudentEnterTheGameRequest {
  player_user_id: string;
  game_id: string;
}

interface StudentEnterTheGameResponse {
  player: StudentsPlayGames;
}

@Injectable()
export class StudentEnterTheGame {
  constructor(
    private studentPlayGameRepository: StudentPlayGameRepository,
    private checkUserCanJoinTheGame: CheckUserCanJoinTheGame,
    private getPlayerPositions: GetPlayerPositions,
    private createAPiece: CreateAPiece,
    private sendWebsocketEvent: SendWebsocketEvent,
    private socketGateway: SocketGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async execute({
    player_user_id,
    game_id,
  }: StudentEnterTheGameRequest): Promise<StudentEnterTheGameResponse> {
    const { error, game, user } = await this.checkUserCanJoinTheGame.execute({
      user_id: player_user_id,
      game_id,
    });

    if (error) throw new HttpException(error, HttpStatus.BAD_REQUEST);

    const { housePosition, positionNumber } = this.getPlayerPositions.execute({
      game,
    });

    const player = new StudentsPlayGames({
      game_id,
      game_position: positionNumber,
      player_user_id,
      start_house: housePosition.start,
      finish_house: housePosition.end,
    });

    await this.studentPlayGameRepository.create(player);

    player.student = user;

    const { piece } = await this.createAPiece.execute({
      student_play_game_id: player.id,
    });

    player.piece = piece;

    const websocketClientId = await this.cacheManager.get<string>(
      player_user_id,
    );

    await this.cacheManager.set(`game-${player_user_id}`, game_id);
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

    return {
      player,
    };
  }
}
