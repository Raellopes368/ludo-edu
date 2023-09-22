import { Game } from '@app/entities/game';
import { Injectable } from '@nestjs/common';

interface GetPlayerPositionsRequest {
  game: Game;
}

interface GetPlayerPositionsResponse {
  positionNumber: number;
  housePosition: {
    start: number;
    end: number;
  };
}

@Injectable()
export class GetPlayerPositions {
  execute({ game }: GetPlayerPositionsRequest): GetPlayerPositionsResponse {
    const numberOfUsersInTheGame = game.players?.length || 0;
    const positionNumber = numberOfUsersInTheGame + 1;
    const positionsOptions = {
      1: {
        start: 1,
        end: 20,
      },
      2: {
        start: 6,
        end: 5,
      },
      3: {
        start: 11,
        end: 10,
      },
      4: {
        start: 16,
        end: 15,
      },
    };

    return {
      positionNumber,
      housePosition: positionsOptions[positionNumber],
    };
  }
}
