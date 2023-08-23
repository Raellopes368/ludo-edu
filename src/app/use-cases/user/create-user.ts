import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../entities/user';
import { UserRepository } from '../../repositories/UserRepository';

interface CreateUserBody {
  email: string;
  password?: string;
  name: string;
  type: number;
  group_id?: string;
}

interface CreateUserResponse {
  user: User;
}

@Injectable()
export class CreateUser {
  constructor(private userRepository: UserRepository) {}
  async execute({
    email,
    password = '',
    name,
    type,
    group_id = null,
  }: CreateUserBody): Promise<CreateUserResponse> {
    const hasUser = await this.userRepository.findByEmail(email);

    if (hasUser) {
      throw new HttpException(
        'Houve um erro ao criar usuário',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User({ email, password, name, type, group_id });

    await this.userRepository.create(user);

    return {
      user,
    };
  }
}
