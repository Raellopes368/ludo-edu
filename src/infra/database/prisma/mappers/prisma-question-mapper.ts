import { Question } from '@app/entities/question';
import { Groups, Questions as QuestionsRaw } from '@prisma/client';
import { PrismaGroupMapper } from './prisma-group-mapper';

interface QuestionData extends QuestionsRaw {
  group?: Groups;
}

export class PrismaQuestionMapper {
  static toPrisma(question: Question): QuestionsRaw {
    return {
      content: question.content,
      group_id: question.group_id,
      level: question.level,
      question_id: question.id,
      user_id: question.user_id,
    };
  }

  static toDomain(question: QuestionData): Question {
    const questionDomain = new Question(
      {
        content: question.content,
        group_id: question.group_id,
        level: question.level,
        user_id: question.user_id,
      },
      question.question_id,
    );

    if (question.group)
      questionDomain.group = PrismaGroupMapper.toDomain(question.group);

    return questionDomain;
  }
}
