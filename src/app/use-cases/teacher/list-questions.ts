import { QuestionsRepository } from '@app/repositories/QuestionsRepository';
import { Injectable } from '@nestjs/common';

interface ListQuestionsRequest {
  user_id: string;
  page?: number;
  per_page?: number;
}

@Injectable()
export class ListQuestions {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ user_id, page = 1, per_page = 10 }: ListQuestionsRequest) {
    const { questions, total_results } =
      await this.questionsRepository.listByTeacher(user_id, page, per_page);

    return {
      questions,
      total_results,
    };
  }
}
