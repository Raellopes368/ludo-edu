import { QuestionsRepository } from '@app/repositories/QuestionsRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CheckStudentCanGetAQuestionToAnswer } from './check-student-can-get-a-question-to-answer';

interface GetQuestionToAnswerRequest {
  user_id: string;
  game_id: string;
}

@Injectable()
export class GetQuestionToAnswer {
  constructor(
    private questionRepository: QuestionsRepository,
    private checkStudentCanGetAQuestionToAnswer: CheckStudentCanGetAQuestionToAnswer,
  ) {}

  async execute({ game_id, user_id }: GetQuestionToAnswerRequest) {
    const error = await this.checkStudentCanGetAQuestionToAnswer.execute({
      game_id,
      user_id,
    });

    if (!!error) throw new HttpException(error, HttpStatus.FORBIDDEN);
    const question = await this.questionRepository.searchForPlayerResponse(
      user_id,
      game_id,
    );

    return {
      question,
    };
  }
}
