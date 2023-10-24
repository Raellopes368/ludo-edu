import { QuestionsRepository } from '@app/repositories/QuestionsRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

interface GetQuestionCompleteRequest {
  user_id: string;
  question_id: string;
}

@Injectable()
export class GetQuestionComplete {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute({ question_id, user_id }: GetQuestionCompleteRequest) {
    const question = await this.questionRepository.getQuestionComplete(
      question_id,
      user_id,
    );

    if (!question)
      throw new HttpException(
        'Houve um erro ao buscar a pergunta',
        HttpStatus.BAD_REQUEST,
      );

    return {
      question,
    };
  }
}
