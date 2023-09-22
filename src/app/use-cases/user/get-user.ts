import { UserRepository } from '@app/repositories/UserRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

interface GetUserRequest {
  user_id: string;
}

@Injectable()
export class GetUser {
  constructor(private userRepository: UserRepository) {}

  async execute({ user_id }: GetUserRequest) {
    const user = await this.userRepository.findByUserId(user_id);

    if (!user)
      throw new HttpException(
        'Houve um erro ao buscar o usuário',
        HttpStatus.NOT_FOUND,
      );

    return {
      user,
    };
  }
}
