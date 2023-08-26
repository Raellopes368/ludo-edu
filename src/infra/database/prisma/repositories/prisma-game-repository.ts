import { Game } from '@app/entities/game';
import { GameRepository } from '@app/repositories/GameRepository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaGameMapper } from '../mappers/prisma-game-mapper';

@Injectable()
export class PrismaGameRepository implements GameRepository {
  constructor(private prisma: PrismaService) {}

  async create(game: Game): Promise<void> {
    const gameRaw = PrismaGameMapper.toPrisma(game);
    await this.prisma.games.create({
      data: gameRaw,
    });
  }
  async findById(game_id: string): Promise<Game> {
    const game = await this.prisma.games.findUnique({
      where: {
        game_id,
      },
      include: {
        players: true,
        current_player: true,
        gamesHasQuestions: true,
        group: true,
        teacher: true,
        winner: true,
      },
    });

    if (!game) return null;

    return PrismaGameMapper.toDomain(game);
  }
  async listByTeacher(teacher_id: string): Promise<Game[]> {
    const games = await this.prisma.games.findMany({
      where: {
        teacher_user_id: teacher_id,
      },
      include: {
        players: true,
        current_player: true,
        gamesHasQuestions: true,
        group: true,
        teacher: true,
        winner: true,
      },
    });

    return games.map((game) => PrismaGameMapper.toDomain(game));
  }
  async listByGroup(group_id: string): Promise<Game[]> {
    const games = await this.prisma.games.findMany({
      where: {
        group_id,
      },
      include: {
        players: true,
        current_player: true,
        gamesHasQuestions: true,
        group: true,
        teacher: true,
        winner: true,
      },
    });

    return games.map((game) => PrismaGameMapper.toDomain(game));
  }
}
