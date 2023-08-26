import { Game } from '@app/entities/game';

export abstract class GameRepository {
  abstract create(game: Game): Promise<void>;
  abstract createMany(game: Game[]): Promise<void>;
  abstract findById(game_id: string): Promise<Game | null>;
  abstract listByTeacher(teacher_id: string): Promise<Game[]>;
  abstract listByGroup(group_id: string): Promise<Game[]>;
}
