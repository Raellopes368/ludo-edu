import { GameRepository } from '@app/repositories/GameRepository';
import { Injectable } from '@nestjs/common';

interface ListGamesByTeacherRequest {
  user_id: string;
  page?: number;
  per_page?: number;
}

@Injectable()
export class ListGamesByTeacher {
  constructor(private gameRepository: GameRepository) {}

  async execute({
    user_id,
    page = 1,
    per_page = 10,
  }: ListGamesByTeacherRequest) {
    const games = await this.gameRepository.listByTeacher(
      user_id,
      page,
      per_page,
    );

    return {
      games,
    };
  }
}
