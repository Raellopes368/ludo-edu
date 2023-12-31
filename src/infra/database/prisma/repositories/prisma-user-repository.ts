import { User } from '@app/entities/user';
import { UserRepository } from '@app/repositories/UserRepository';
import { Injectable } from '@nestjs/common';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { PrismaService } from '../prisma.service';
import { UserType } from 'src/interfaces';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const raw = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.create({
      data: raw,
    });
  }

  async update(user: User): Promise<void> {
    const raw = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.update({
      data: raw,
      where: {
        user_id: user.id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByUserId(user_id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async search(term: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: term,
              mode: 'insensitive',
            },
          },
          {
            email: term,
          },
        ],
        type: UserType.TEACHER,
      },
    });
    return users.map((user) => PrismaUserMapper.toDomain(user));
  }
}
