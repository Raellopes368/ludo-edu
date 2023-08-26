import { Game } from '@app/entities/game';
import { GameRepository } from '@app/repositories/GameRepository';
import { Injectable } from '@nestjs/common';

interface CreateAGameRequest {
  game_level: number;
  teacher_user_id: string;
  group_id: string;
}

@Injectable()
export class CreateAGame {
  constructor(private gameRepository: GameRepository) {}
  async execute({ game_level, group_id, teacher_user_id }: CreateAGameRequest) {
    const game = new Game({
      game_level,
      group_id,
      teacher_user_id,
    });
    await this.gameRepository.create(game);

    return {
      game,
    };
  }
}
