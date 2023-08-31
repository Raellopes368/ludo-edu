/* eslint-disable @typescript-eslint/no-unused-vars */
import { Question } from '@app/entities/question';
import { QuestionsRepository } from '@app/repositories/QuestionsRepository';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Questions, QuestionOptions } from '@prisma/client';

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

  async listByGroup(group_id: string): Promise<Question[]> {
    const questions = await this.prisma.questions.findMany({
      where: {
        groupsHasQuestions: {
          every: {
            group_id,
          },
        },
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
  async listByGame(game_id: string): Promise<Question[]> {
    const gameHasQuestions = await this.prisma.gamesHasQuestions.findMany({
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
    });

    return gameHasQuestions.map((item) =>
      PrismaQuestionMapper.toDomain(item.question),
    );
  }
}
