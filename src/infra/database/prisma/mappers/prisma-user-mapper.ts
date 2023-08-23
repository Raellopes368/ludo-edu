import { User } from '@app/entities/user';
import { User as UserRaw } from '@prisma/client';

export class PrismaUserMapper {
  static toPrisma(user: User): UserRaw {
    return {
      user_id: user.id,
      email: user.email,
      password: user.password,
      group_id: user.group_id,
      name: user.name,
      type: user.type,
    };
  }

  static toDomain(user: UserRaw) {
    const userDomain = new User(
      {
        email: user.email,
        password: user.password,
        name: user.name,
        type: user.type,
        group_id: user.group_id,
      },
      user.user_id,
    );

    return userDomain;
  }
}
