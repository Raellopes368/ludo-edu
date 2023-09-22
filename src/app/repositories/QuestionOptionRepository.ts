import { QuestionOptions } from '@app/entities/question/QuestionOption';

export abstract class QuestionOptionRepository {
  abstract createMany(questionOption: QuestionOptions[]): Promise<void>;
  abstract update(questionOption: QuestionOptions): Promise<void>;
  abstract findById(
    question_option_id: string,
  ): Promise<QuestionOptions | null>;
}
