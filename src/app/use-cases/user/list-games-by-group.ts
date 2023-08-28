import { GameRepository } from '@app/repositories/GameRepository';
import { Injectable } from '@nestjs/common';

interface ListGamesByGroupRequest {
  group_id: string;
  page?: number;
  per_page?: number;
}

@Injectable()
export class ListGamesByGroup {
  constructor(private gameRepository: GameRepository) {}

  async execute({ group_id, page, per_page }: ListGamesByGroupRequest) {
    const { games, total_results } = await this.gameRepository.listByGroup(
      group_id,
      page,
      per_page,
    );

    return {
      games,
      total_results,
    };
  }
}
