import { Game } from '@app/entities/game';
import { GameRepository } from '@app/repositories/GameRepository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaGameMapper } from '../mappers/prisma-game-mapper';
import { GameResponse } from 'src/interfaces';

@Injectable()
export class PrismaGameRepository implements GameRepository {
  constructor(private prisma: PrismaService) {}

  async create(game: Game): Promise<void> {
    const gameRaw = PrismaGameMapper.toPrisma(game);
    await this.prisma.games.create({
      data: {
        ...gameRaw,
        gamesHasQuestions: {
          createMany: {
            data: [
              {
                question_id: '',
              },
            ],
          },
        },
      },
    });
  }

  async update(game: Game): Promise<void> {
    const gameRaw = PrismaGameMapper.toPrisma(game);
    await this.prisma.games.update({
      data: gameRaw,
      where: {
        game_id: game.id,
      },
    });
  }

  async listQuestionsByGroupAndLevel(group_id: string, level: number) {
    const questions = await this.prisma.questions.findMany({
      where: {
        level,
        groupsHasQuestions: {
          every: {
            group_id,
          },
        },
      },
      select: {
        question_id: true,
      },
    });

    return questions;
  }

  async createMany(games: Game[]): Promise<void> {
    const gamesRaw = games.map((game) => PrismaGameMapper.toPrisma(game));
    await this.prisma.games.createMany({
      data: gamesRaw,
    });
    const allQuestions = await Promise.all(
      games.map((game) =>
        this.listQuestionsByGroupAndLevel(game.group_id, game.game_level),
      ),
    );
    const gamesHasQuestions = [];

    games.forEach((game, index) => {
      allQuestions[index].forEach((question) => {
        gamesHasQuestions.push({
          game_id: game.id,
          question_id: question.question_id,
        });
      });
    });

    await this.prisma.gamesHasQuestions.createMany({
      data: gamesHasQuestions,
    });
  }

  async addQuestionsToGame(
    game_id: string,
    questions_id: string[],
  ): Promise<void> {
    await this.prisma.gamesHasQuestions.createMany({
      data: questions_id.map((item) => ({
        game_id,
        question_id: item,
      })),
    });
  }
  async findById(game_id: string): Promise<Game> {
    const {
      _count: { gamesHasQuestions },
      ...game
    } = await this.prisma.games.findUnique({
      where: {
        game_id,
      },
      include: {
        _count: {
          select: {
            gamesHasQuestions: true,
          },
        },
        players: {
          include: {
            userCheckOptions: {
              select: {
                question_option: true,
              },
            },
            player: true,
          },
        },
        current_player: true,
        gamesHasQuestions: {
          include: {
            question: {
              include: {
                questionOptions: true,
              },
            },
          },
        },
        group: true,
        teacher: true,
        winner: true,
      },
    });

    if (!game) return null;
    const { players, ...gameData } = game;
    const playerScores: any = {};
    players.forEach((player) => {
      player.userCheckOptions?.forEach((checkedOption) => {
        const points = checkedOption.question_option.points || 0;
        playerScores[player.player_user_id] =
          (playerScores[player.player_user_id] || 0) + points;
      });
    });

    return PrismaGameMapper.toDomain({
      ...gameData,
      amount_questions: gamesHasQuestions,
      players: players.map((player) => ({
        ...player,
        points: playerScores[player.player_user_id],
      })),
    });
  }

  async getById(game_id: string): Promise<Game> {
    const {
      _count: { gamesHasQuestions },
      ...game
    } = await this.prisma.games.findUnique({
      where: {
        game_id,
      },
      include: {
        _count: {
          select: {
            gamesHasQuestions: true,
          },
        },
        players: {
          include: {
            userCheckOptions: {
              select: {
                question_option: true,
              },
            },
            player: {
              include: {
                studentsPlayGames: {
                  include: {
                    player: true,
                  },
                },
              },
            },
          },
        },
        current_player: true,
        group: true,
        teacher: true,
        winner: true,
      },
    });

    if (!game) return null;
    const { players, ...gameData } = game;

    const playerScores: any = {};
    players.forEach((player) => {
      player.userCheckOptions?.forEach((checkedOption) => {
        const points = checkedOption.question_option.points || 0;
        playerScores[player.player_user_id] =
          (playerScores[player.player_user_id] || 0) + points;
      });
    });

    return PrismaGameMapper.toDomain({
      ...gameData,
      amount_questions: gamesHasQuestions,
      players: players.map((player) => ({
        ...player,
        points: playerScores[player.player_user_id],
      })),
    });
  }

  async countGamesByTeacher(teacher_id: string): Promise<number> {
    const total = await this.prisma.games.count({
      where: {
        teacher_user_id: teacher_id,
      },
    });
    return total;
  }
  async countGamesByGroup(group_id: string): Promise<number> {
    const total = await this.prisma.games.count({
      where: {
        group_id,
      },
    });
    return total;
  }
  async listByTeacher(
    teacher_id: string,
    page: number,
    per_page: number,
  ): Promise<GameResponse> {
    const offset = page * per_page - per_page;
    const [games, total] = await Promise.all([
      this.prisma.games.findMany({
        skip: offset,
        take: per_page,
        where: {
          teacher_user_id: teacher_id,
        },
        include: {
          players: {
            include: {
              player: {
                include: {
                  studentsPlayGames: {
                    include: {
                      player: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  userCheckOptions: {
                    where: {
                      is_invalid: false,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              gamesHasQuestions: true,
            },
          },
          winner: {
            include: {
              player: true,
            },
          },
        },
      }),
      this.countGamesByTeacher(teacher_id),
    ]);
    return {
      games: games.map(({ players, ...game }) =>
        PrismaGameMapper.toDomain({
          ...game,
          amount_questions: game._count.gamesHasQuestions,
          players: players.map(({ _count, ...player }) => ({
            ...player,
            points: _count.userCheckOptions,
          })),
        }),
      ),
      total_results: total,
    };
  }
  async listByGroup(
    group_id: string,
    page: number,
    per_page: number,
  ): Promise<GameResponse> {
    const offset = page * per_page - per_page;
    const [games, total] = await Promise.all([
      this.prisma.games.findMany({
        skip: offset,
        take: per_page,
        where: {
          group_id,
        },
        include: {
          _count: {
            select: {
              gamesHasQuestions: true,
            },
          },
        },
      }),
      this.countGamesByGroup(group_id),
    ]);

    return {
      games: games.map(({ _count: { gamesHasQuestions }, ...game }) =>
        PrismaGameMapper.toDomain({
          ...game,
          amount_questions: gamesHasQuestions,
        }),
      ),
      total_results: total,
    };
  }
}
