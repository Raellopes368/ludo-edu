import { Game } from '@app/entities/game';
import { GameRepository } from '@app/repositories/GameRepository';
import { Injectable } from '@nestjs/common';

interface CreateGamesRequest {
  amount_games: number;
  game_level: number;
  teacher_user_id: string;
  group_id: string;
}

@Injectable()
export class CreateGames {
  constructor(private gameRepository: GameRepository) {}
  async execute({
    game_level,
    group_id,
    teacher_user_id,
    amount_games,
  }: CreateGamesRequest) {
    const games = Array.from({ length: amount_games }).fill(
      () =>
        new Game({
          game_level,
          group_id,
          teacher_user_id,
        }),
    ) as Game[];
    await this.gameRepository.createMany(games);

    return {
      games,
    };
  }
}
