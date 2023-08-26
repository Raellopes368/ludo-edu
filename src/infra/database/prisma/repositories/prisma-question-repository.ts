import { Question } from '@app/entities/question';
import { QuestionsRepository } from '@app/repositories/QuestionsRepository';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}
  async create(question: Question): Promise<void> {
    const questionRaw = PrismaQuestionMapper.toPrisma(question);
    await this.prisma.questions.create({
      data: questionRaw,
    });
  }
  async findById(question_id: string): Promise<Question> {
    const question = await this.prisma.questions.findUnique({
      where: {
        question_id,
      },
    });

    if (!question) return null;

    return PrismaQuestionMapper.toDomain(question);
  }
  async listByGroup(group_id: string): Promise<Question[]> {
    const questions = await this.prisma.questions.findMany({
      where: {
        group_id,
      },
    });

    return questions.map((question) => PrismaQuestionMapper.toDomain(question));
  }
  async listByTeacher(teacher_id: string): Promise<Question[]> {
    const questions = await this.prisma.questions.findMany({
      where: {
        user_id: teacher_id,
      },
    });

    return questions.map((question) => PrismaQuestionMapper.toDomain(question));
  }
  async listByGame(group_id: string): Promise<Question[]> {
    const questions = await this.prisma.questions.findMany({
      where: {
        group_id,
      },
    });

    return questions.map((question) => PrismaQuestionMapper.toDomain(question));
  }
}
