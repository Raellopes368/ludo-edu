import { UserRepository } from '@app/repositories/UserRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserType } from 'src/interfaces';

interface StudentJoinsAGroupRequest {
  user_id: string;
  group_id: string;
}

@Injectable()
export class StudentJoinsAGroup {
  constructor(private userRepository: UserRepository) {}

  async execute({ group_id, user_id }: StudentJoinsAGroupRequest) {
    const user = await this.userRepository.findByUserId(user_id);
    if (!user || user.type !== UserType.STUDENT)
      throw new HttpException(
        'Usuário não pode entrar no grupo',
        HttpStatus.BAD_REQUEST,
      );

    user.group_id = group_id;

    await this.userRepository.update(user);

    return {
      user,
    };
  }
}
