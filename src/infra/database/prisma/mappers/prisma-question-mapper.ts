import { Question } from '@app/entities/question';
import {
  Groups,
  QuestionOptions,
  Questions as QuestionsRaw,
} from '@prisma/client';
import { PrismaGroupMapper } from './prisma-group-mapper';
import { PrismaQuestionOptionsMapper } from './prisma-question-option-mapper';

interface QuestionData extends QuestionsRaw {
  group?: Groups;
  questionOptions?: QuestionOptions[];
}

export class PrismaQuestionMapper {
  static toPrisma(question: Question): QuestionsRaw {
    return {
      content: question.content,
      level: question.level,
      question_id: question.id,
      user_id: question.user_id,
    };
  }

  static toDomain(question: QuestionData): Question {
    const questionDomain = new Question(
      {
        content: question.content,
        level: question.level,
        user_id: question.user_id,
      },
      question.question_id,
    );

    if (question.group)
      questionDomain.group = PrismaGroupMapper.toDomain(question.group);
    if (question.questionOptions)
      questionDomain.questionOptions = question.questionOptions.map((option) =>
        PrismaQuestionOptionsMapper.toDomain(option),
      );

    return questionDomain;
  }
}
