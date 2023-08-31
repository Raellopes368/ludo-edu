import { Question } from '@app/entities/question';
import { QuestionsRepository } from '@app/repositories/QuestionsRepository';
import { Injectable } from '@nestjs/common';

interface CreateQuestionRequest {
  content: string;
  level: number;
  user_id: string;
}

@Injectable()
export class CreateQuestion {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute(request: CreateQuestionRequest) {
    const question = new Question(request);

    await this.questionRepository.create(question);

    return {
      question,
    };
  }
}
