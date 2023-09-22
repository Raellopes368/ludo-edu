import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GroupsRepository } from '@app/repositories/GroupsRepository';
import { Groups } from '@app/entities/groups';
import { PrismaGroupMapper } from '../mappers/prisma-group-mapper';

@Injectable()
export class PrismaGroupRepository implements GroupsRepository {
  constructor(private prisma: PrismaService) {}
  async create(group: Groups): Promise<void> {
    const groupRaw = PrismaGroupMapper.toPrisma(group);
    await this.prisma.groups.create({
      data: groupRaw,
    });
  }

  async addQuestionsToGroup(
    group_id: string,
    questions_id: string[],
  ): Promise<void> {
    await this.prisma.groupsHasQuestions.createMany({
      data: questions_id.map((question_id) => ({
        group_id,
        question_id,
      })),
    });
  }

  async getByGroupId(group_id: string): Promise<Groups> {
    const group = await this.prisma.groups.findUnique({
      where: {
        group_id,
      },
      include: {
        teacher_owner: true,
      },
    });

    if (!group) return null;

    return PrismaGroupMapper.toDomain(group);
  }
  async listByTeacherId(teacher_user_id: string): Promise<Groups[]> {
    const groups = await this.prisma.groups.findMany({
      where: {
        teacher_owner_user_id: teacher_user_id,
      },
    });

    return groups.map((group) => PrismaGroupMapper.toDomain(group));
  }
  async findByName(name: string): Promise<Groups> {
    const group = await this.prisma.groups.findFirst({
      where: {
        name,
      },
    });

    if (!group) return null;

    return PrismaGroupMapper.toDomain(group);
  }
}
