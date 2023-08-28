import { GameRepository } from '@app/repositories/GameRepository';
import { Injectable } from '@nestjs/common';

interface ListGamesByGroupRequest {
  group_id: string;
}

@Injectable()
export class ListGamesByGroup {
  constructor(private gameRepository: GameRepository) {}

  async execute({ group_id }: ListGamesByGroupRequest) {
    const games = await this.gameRepository.listByGroup(group_id);

    return {
      games,
    };
  }
}
