import { GameRepository } from '@app/repositories/GameRepository';
import { Injectable } from '@nestjs/common';

interface ListGamesByTeacherRequest {
  user_id: string;
}

@Injectable()
export class ListGamesByTeacher {
  constructor(private gameRepository: GameRepository) {}

  async execute({ user_id }: ListGamesByTeacherRequest) {
    const games = await this.gameRepository.listByTeacher(user_id);

    return {
      games,
    };
  }
}
