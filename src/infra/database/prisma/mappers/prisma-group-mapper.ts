import { User } from '@app/entities/user';
import { User as UserRaw } from '@prisma/client';

export class PrismaGroupMapper {
  static toPrisma(user: User): UserRaw {
    return {
      email: user.email,
      group_id: user.group_id,
      name: user.name,
      password: user.password,
      type: user.type,
      user_id: user.id,
    };
  }

  static toDomain(user: UserRaw): User {
    return new User(
      {
        email: user.email,
        name: user.name,
        password: user.password,
        type: user.type,
        group_id: user.group_id,
      },
      user.user_id,
    );
  }
}
