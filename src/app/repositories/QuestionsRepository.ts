import { Question } from '@app/entities/question';

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>;
  abstract findById(question_id: string): Promise<Question | null>;
  abstract listByGroup(group_id: string): Promise<Question[]>;
  abstract listByTeacher(teacher_id: string): Promise<Question[]>;
  abstract listByGame(group_id: string): Promise<Question[]>;
  abstract searchForPlayerResponse(
    player_id: string,
    game_id: string,
  ): Promise<Question>;
}
