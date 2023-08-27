import { StudentsPlayGames } from '@app/entities/studentsPlayGames';

export abstract class StudentPlayGameRepository {
  abstract create(studentPlayGame: StudentsPlayGames): Promise<void>;
  abstract findByUserId(user_id: string): Promise<StudentsPlayGames | null>;
  abstract listByGame(game_id: string): Promise<StudentsPlayGames[]>;
}
