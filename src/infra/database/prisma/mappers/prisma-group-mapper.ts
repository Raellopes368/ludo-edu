import { Groups } from '@app/entities/groups';
import { Groups as GroupsRaw, User } from '@prisma/client';
import { PrismaUserMapper } from './prisma-user-mapper';

interface GroupData extends GroupsRaw {
  teacher_owner?: User;
  students?: User[];
}

export class PrismaGroupMapper {
  static toPrisma(group: Groups): GroupsRaw {
    return {
      description: group.description,
      group_id: group.group_id,
      name: group.name,
      teacher_owner_user_id: group.teacher_owner_user_id,
    };
  }

  static toDomain(group: GroupData): Groups {
    const groupDomain = new Groups(
      {
        description: group.description,
        name: group.name,
        teacher_owner_user_id: group.teacher_owner_user_id,
      },
      group.group_id,
    );

    if (group.teacher_owner)
      groupDomain.teacher_owner = PrismaUserMapper.toDomain(
        group.teacher_owner,
      );

    if (group.students)
      groupDomain.students = group.students.map((student) =>
        PrismaUserMapper.toDomain(student),
      );
    return groupDomain;
  }
}
