import { UserCheckOptions } from '@app/entities/userCheckOptions';
import { UserCheckOptionsRepository } from '@app/repositories/UserCheckOptionsRepository';
import { PrismaUserCheckOptionsMapper } from '../mappers/prisma-user-check-options-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserCheckOptionsRepository
  implements UserCheckOptionsRepository
{
  constructor(private prisma: PrismaService) {}
  async create(userCheckOptions: UserCheckOptions): Promise<void> {
    const raw = PrismaUserCheckOptionsMapper.toPrisma(userCheckOptions);
    await this.prisma.userCheckOptions.create({
      data: raw,
    });
  }
  async update(userCheckOptions: UserCheckOptions): Promise<void> {
    const raw = PrismaUserCheckOptionsMapper.toPrisma(userCheckOptions);
    await this.prisma.userCheckOptions.update({
      data: raw,
      where: {
        user_check_options_id: userCheckOptions.id,
      },
    });
  }
  async findByQuestionAndGame(
    question_id: string,
    game_id: string,
  ): Promise<UserCheckOptions> {
    const userCheckOptions = await this.prisma.userCheckOptions.findFirst({
      where: {
        question_option: {
          question: {
            question_id,
          },
        },
        player: {
          game_id,
        },
      },
    });

    if (!userCheckOptions) return null;
    return PrismaUserCheckOptionsMapper.toDomain(userCheckOptions);
  }
  async getUserPoints(
    student_user_id: string,
    game_id: string,
  ): Promise<number> {
    const {
      _sum: { points },
    } = await this.prisma.questionOptions.aggregate({
      _sum: {
        points: true,
      },
      where: {
        userCheckOptions: {
          every: {
            student_user_id,
            player: {
              game_id,
            },
            is_invalid: false,
          },
        },
      },
    });

    return points;
  }

  async invalidateByUser(player_id: string): Promise<void> {
    await this.prisma.userCheckOptions.updateMany({
      where: {
        student_user_id: player_id,
      },
      data: {
        is_invalid: true,
      },
    });
  }
}
