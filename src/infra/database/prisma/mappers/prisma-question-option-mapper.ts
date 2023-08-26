import { QuestionOptions } from '@app/entities/question/QuestionOption';
import {
  QuestionOptions as QuestionOptionsRaw,
  Questions,
} from '@prisma/client';
import { PrismaQuestionMapper } from './prisma-question-mapper';

interface QuestionOptionsData extends QuestionOptionsRaw {
  question?: Questions;
}

export class PrismaQuestionOptionsMapper {
  static toPrisma(option: QuestionOptions): QuestionOptionsRaw {
    return {
      content: option.content,
      points: option.points,
      question_id: option.question_id,
      question_option_id: option.id,
    };
  }

  static toDomain(option: QuestionOptionsData): QuestionOptions {
    const optionDomain = new QuestionOptions(
      {
        content: option.content,
        points: option.points,
        question_id: option.question_id,
      },
      option.question_option_id,
    );

    if (option.question)
      optionDomain.question = PrismaQuestionMapper.toDomain(option.question);

    return optionDomain;
  }
}
