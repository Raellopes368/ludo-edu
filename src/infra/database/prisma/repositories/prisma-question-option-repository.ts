import { QuestionOptions } from '@app/entities/question/QuestionOption';
import { QuestionOptionRepository } from '@app/repositories/QuestionOptionRepository';
import { PrismaQuestionOptionsMapper } from '../mappers/prisma-question-option-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionOptionRepository
  implements QuestionOptionRepository
{
  constructor(private prisma: PrismaService) {}
  async createMany(questionOptions: QuestionOptions[]): Promise<void> {
    const questionsOptionsRaw = questionOptions.map((option) =>
      PrismaQuestionOptionsMapper.toPrisma(option),
    );

    await this.prisma.questionOptions.createMany({
      data: questionsOptionsRaw,
    });
  }
  async update(questionOption: QuestionOptions): Promise<void> {
    const questionOptionRaw =
      PrismaQuestionOptionsMapper.toPrisma(questionOption);
    await this.prisma.questionOptions.update({
      where: {
        question_option_id: questionOption.id,
      },
      data: questionOptionRaw,
    });
  }
}
