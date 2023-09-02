import { StudentsPlayGames } from '@app/entities/studentsPlayGames';
import { StudentPlayGameRepository } from '@app/repositories/StudentPlayGameRepository';
import { Injectable } from '@nestjs/common';
import { PrismaStudentPlayGameMapper } from '../mappers/prisma-student-play-game-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaStudentPlayGameRepository
  implements StudentPlayGameRepository
{
  constructor(private prisma: PrismaService) {}
  async create(studentPlayGame: StudentsPlayGames): Promise<void> {
    const playerRaw = PrismaStudentPlayGameMapper.toPrisma(studentPlayGame);
    await this.prisma.studentsPlayGames.create({
      data: playerRaw,
    });
  }

  async findFirstByGame(game_id: string): Promise<StudentsPlayGames> {
    const player = await this.prisma.studentsPlayGames.findFirst({
      where: {
        game_id,
      },
      include: {
        piece: true,
      },
      orderBy: {
        game_position: 'asc',
      },
    });

    if (!player) return null;
    return PrismaStudentPlayGameMapper.toDomain(player);
  }
  async findByUserIdAndGame(
    user_id: string,
    game_id: string,
  ): Promise<StudentsPlayGames> {
    const player = await this.prisma.studentsPlayGames.findFirst({
      where: {
        AND: [{ player_user_id: user_id }, { game_id }],
      },
      include: {
        piece: true,
      },
    });

    if (!player) return null;
    return PrismaStudentPlayGameMapper.toDomain(player);
  }
  async listByGame(game_id: string): Promise<StudentsPlayGames[]> {
    const players = await this.prisma.studentsPlayGames.findMany({
      where: {
        game_id,
      },
      include: {
        piece: true,
      },
    });

    return players.map((player) =>
      PrismaStudentPlayGameMapper.toDomain(player),
    );
  }
}
