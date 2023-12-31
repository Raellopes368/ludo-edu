import { Question } from '@app/entities/question';
import { GroupViewModel } from './group-view-model';
import { QuestionOptionViewModel } from './question-option-view-model';

export class QuestionViewModel {
  static toHTTP(question: Question, points?: boolean) {
    return {
      content: question.content,
      group: question.group ? GroupViewModel.toHTTP(question.group) : null,
      level: question.level,
      id: question.id,
      teacher_id: question.user_id,
      options: question.questionOptions?.map((option) =>
        QuestionOptionViewModel.toHTTP(option, points),
      ),
    };
  }
}
