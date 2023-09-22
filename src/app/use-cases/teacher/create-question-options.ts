import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CheckUserCanCreateQuestionOptions } from './check-user-can-create-question-options';
import { QuestionOptionRepository } from '@app/repositories/QuestionOptionRepository';
import { QuestionOptions } from '@app/entities/question/QuestionOption';

export interface QuestionOptionsData {
  points: number;
  content: string;
}
interface CreateQuestionOptionsRequest {
  user_id: string;
  options: QuestionOptionsData[];
  question_id: string;
}

@Injectable()
export class CreateQuestionOptions {
  constructor(
    private checkUserCanCreateQuestionOptions: CheckUserCanCreateQuestionOptions,
    private questionOptionRepository: QuestionOptionRepository,
  ) {}
  async execute({
    options,
    question_id,
    user_id,
  }: CreateQuestionOptionsRequest) {
    const { error } = await this.checkUserCanCreateQuestionOptions.execute({
      options,
      question_id,
      user_id,
    });

    if (error) throw new HttpException(error, HttpStatus.FORBIDDEN);

    const questionOptions = options.map(
      (option) =>
        new QuestionOptions({
          ...option,
          question_id,
        }),
    );

    await this.questionOptionRepository.createMany(questionOptions);

    return {
      questionOptions,
    };
  }
}
