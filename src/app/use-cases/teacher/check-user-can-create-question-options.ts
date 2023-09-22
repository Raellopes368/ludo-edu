import { QuestionsRepository } from '@app/repositories/QuestionsRepository';
import { Injectable } from '@nestjs/common';
import { QuestionOptionsData } from './create-question-options';

interface CheckUserCanCreateQuestionOptionsRequest {
  user_id: string;
  question_id: string;
  options: QuestionOptionsData[];
}

@Injectable()
export class CheckUserCanCreateQuestionOptions {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute({
    user_id,
    question_id,
    options,
  }: CheckUserCanCreateQuestionOptionsRequest) {
    const result: { error: string | null; success: boolean } = {
      error: null,
      success: true,
    };
    const question = await this.questionRepository.findById(question_id);
    if (!question || question.user_id !== user_id)
      result.error = 'Usuário não pode criar essas opções';

    if (question.questionOptions?.length)
      result.error = 'As opções já foram criadas';
    if (!options.filter((option) => option.points === 0))
      result.error = 'Você precisa informar pelo menos uma questão com valor 0';
    if (!options.filter((option) => option.points > 0))
      result.error =
        'Você precisa informar pelo menos uma questão com valor maior que 0';
    return {
      ...result,
      success: !!result.error,
    };
  }
}
