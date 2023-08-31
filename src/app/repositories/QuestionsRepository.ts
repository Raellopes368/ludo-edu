import { Question } from '@app/entities/question';
import { QuestionsReponse } from 'src/interfaces';

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>;
  abstract findById(question_id: string): Promise<Question | null>;
  abstract listByGroup(
    group_id: string,
    page: number,
    per_page: number,
  ): Promise<QuestionsReponse>;
  abstract listByTeacher(
    teacher_id: string,
    page: number,
    per_page: number,
  ): Promise<QuestionsReponse>;
  abstract listByGame(
    group_id: string,
    page: number,
    per_page: number,
  ): Promise<QuestionsReponse>;
  abstract searchForPlayerResponse(
    player_id: string,
    game_id: string,
  ): Promise<Question>;
}
