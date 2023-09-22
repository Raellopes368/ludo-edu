import { StudentsPlayGames } from '@app/entities/studentsPlayGames';

export abstract class StudentPlayGameRepository {
  abstract create(studentPlayGame: StudentsPlayGames): Promise<void>;
  abstract findByUserIdAndGame(
    user_id: string,
    game_id: string,
  ): Promise<StudentsPlayGames | null>;
  abstract findFirstByGame(game_id: string): Promise<StudentsPlayGames>;
  abstract listByGame(game_id: string): Promise<StudentsPlayGames[]>;
}
