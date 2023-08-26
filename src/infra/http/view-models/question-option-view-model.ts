import { QuestionOptions } from '@app/entities/question/QuestionOption';
import { QuestionViewModel } from './question-view-model';

export class QuestionOptionViewModel {
  static toHTTP(questionOption: QuestionOptions, showPoints = false) {
    return {
      content: questionOption.content,
      question: questionOption.question
        ? QuestionViewModel.toHTTP(questionOption.question)
        : null,
      question_id: questionOption.question_id,
      points: showPoints ? questionOption.points : null,
      id: questionOption.id,
    };
  }
}
