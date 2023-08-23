import { User } from '@app/entities/user';

export class UserViewModel {
  static toHTTP(user: User) {
    const userData: any = {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
      group_id: user.group_id,
    };

    return userData;
  }
}
