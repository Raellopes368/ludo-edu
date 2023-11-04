import { QuestionsRepository } from '@app/repositories/QuestionsRepository';
import { Injectable } from '@nestjs/common';

interface ListQuestionsByGroupRequest {
  group_id: string;
  page?: number;
  per_page?: number;
}

@Injectable()
export class ListQuestionsByGroup {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({
    group_id,
    page = 1,
    per_page = 10,
  }: ListQuestionsByGroupRequest) {
    const { questions, total_results } =
      await this.questionsRepository.listByGroup(group_id, page, per_page);

    return {
      questions,
      total_results,
    };
  }
}
