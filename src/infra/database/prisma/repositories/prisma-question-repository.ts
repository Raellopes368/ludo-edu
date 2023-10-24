/* eslint-disable @typescript-eslint/no-unused-vars */
import { Question } from '@app/entities/question';
import { QuestionsRepository } from '@app/repositories/QuestionsRepository';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Questions, QuestionOptions } from '@prisma/client';
import { QuestionsReponse } from 'src/interfaces';

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
      include: {
        questionOptions: true,
        teacher: true,
      },
    });

    if (!question) return null;

    return PrismaQuestionMapper.toDomain(question);
  }

  async getQuestionComplete(
    question_id: string,
    user_id: string,
  ): Promise<Question> {
    const question = await this.prisma.questions.findFirst({
      where: {
        question_id,
        user_id,
      },
      include: {
        questionOptions: true,
        teacher: true,
      },
    });

    if (!question) return null;

    return PrismaQuestionMapper.toDomain(question);
  }

  async searchForPlayerResponse(
    player_id: string,
    game_id: string,
  ): Promise<Question> {
    const questions = await this.prisma.$queryRawUnsafe<
      (Questions & QuestionOptions & { questionContent: string })[]
    >(`
		SELECT q.*, q.content as questionContent, qo.*, uco.updated_at AS answered_at
		FROM questions q
		JOIN games_has_questions ghq ON q.question_id = ghq.question_id
		LEFT JOIN question_options qo ON q.question_id = qo.question_id
		LEFT JOIN (
			SELECT qo.question_id, uco.updated_at
			FROM question_options qo
			JOIN user_check_options uco ON qo.question_option_id = uco.question_option_id
			JOIN students_play_games spg ON uco.student_user_id = spg.student_play_game_id
			WHERE spg.player_user_id = '${player_id}'
		) answered_questions ON q.question_id = answered_questions.question_id
		LEFT JOIN user_check_options uco ON qo.question_option_id = uco.question_option_id AND uco.student_user_id = '${player_id}'
		WHERE ghq.game_id = '${game_id}'
		ORDER BY answered_questions.updated_at ASC NULLS FIRST, q.question_id
		LIMIT 5;
		`);

    if (!questions.length) return null;

    const [{ question_id, questionContent, level, user_id }] = questions;

    return PrismaQuestionMapper.toDomain({
      question_id,
      content: questionContent,
      level,
      user_id,
      questionOptions: questions.map(
        ({ question_id, questionContent, level, user_id, ...rest }) => ({
          ...rest,
          question_id,
        }),
      ),
    });
  }

  async getCountByGroup(group_id: string) {
    const total = await this.prisma.questions.count({
      where: {
        groupsHasQuestions: {
          every: {
            group_id,
          },
        },
      },
    });

    return total;
  }

  async getCountByTeacher(teacher_id: string) {
    const total = await this.prisma.questions.count({
      where: {
        user_id: teacher_id,
      },
    });

    return total;
  }

  async getCountByGame(game_id: string) {
    const total = await this.prisma.gamesHasQuestions.count({
      where: {
        game_id,
      },
    });

    return total;
  }

  async listByGroup(
    group_id: string,
    page: number,
    per_page: number,
  ): Promise<QuestionsReponse> {
    const offset = page * per_page - per_page;
    const [questions, total_results] = await Promise.all([
      this.prisma.questions.findMany({
        skip: offset,
        take: per_page,
        where: {
          groupsHasQuestions: {
            every: {
              group_id,
            },
          },
        },
        include: {
          questionOptions: true,
        },
      }),
      this.getCountByGroup(group_id),
    ]);

    return {
      questions: questions.map((question) =>
        PrismaQuestionMapper.toDomain(question),
      ),
      total_results,
    };
  }

  async listByTeacher(
    teacher_id: string,
    page: number,
    per_page: number,
  ): Promise<QuestionsReponse> {
    const offset = page * per_page - per_page;
    const [questions, total_results] = await Promise.all([
      this.prisma.questions.findMany({
        skip: offset,
        take: per_page,
        where: {
          user_id: teacher_id,
        },
        include: {
          questionOptions: {
            orderBy: {
              content: 'asc',
            },
          },
        },
      }),
      this.getCountByTeacher(teacher_id),
    ]);

    return {
      questions: questions.map((question) =>
        PrismaQuestionMapper.toDomain(question),
      ),
      total_results,
    };
  }
  async listByGame(
    game_id: string,
    page: number,
    per_page: number,
  ): Promise<QuestionsReponse> {
    const offset = page * per_page - per_page;
    const [gameHasQuestions, total_results] = await Promise.all([
      this.prisma.gamesHasQuestions.findMany({
        skip: offset,
        take: per_page,
        where: {
          game_id,
        },
        include: {
          question: {
            include: {
              questionOptions: true,
            },
          },
        },
      }),
      this.getCountByGame(game_id),
    ]);

    return {
      questions: gameHasQuestions.map((item) =>
        PrismaQuestionMapper.toDomain(item.question),
      ),
      total_results,
    };
  }
}
