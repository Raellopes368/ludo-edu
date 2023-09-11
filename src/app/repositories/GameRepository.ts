import { Game } from '@app/entities/game';
import { GameResponse } from 'src/interfaces';

export abstract class GameRepository {
  abstract create(game: Game): Promise<void>;
  abstract update(game: Game): Promise<void>;
  abstract addQuestionsToGame(
    game_id: string,
    questions_id: string[],
  ): Promise<void>;
  abstract createMany(game: Game[]): Promise<void>;
  abstract findById(game_id: string): Promise<Game | null>;
  abstract getById(game_id: string): Promise<Game | null>;
  abstract listByTeacher(
    teacher_id: string,
    page: number,
    per_page: number,
  ): Promise<GameResponse>;
  abstract countGamesByTeacher(teacher_id: string): Promise<number>;
  abstract countGamesByGroup(group_id: string): Promise<number>;
  abstract listByGroup(
    group_id: string,
    page: number,
    per_page: number,
  ): Promise<GameResponse>;
}
