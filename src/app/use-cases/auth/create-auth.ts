import { User } from '@app/entities/user';
import { UserRepository } from '@app/repositories/UserRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '@infra/auth/constants';

export interface CreateAuthRequest {
  email: string;
  password: string;
}

interface CreateAuthResponse {
  user: User;
}

@Injectable()
export class CreateAuth {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(request: CreateAuthRequest): Promise<CreateAuthResponse> {
    const { email, password } = request;
    const user = await this.userRepository.findByEmail(email);

    if (!user)
      throw new HttpException(
        'Usuário ou senha incorretos',
        HttpStatus.BAD_REQUEST,
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(
        'Usuário ou senha incorretos',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      user,
    };
  }

  async login({ user }: { user: User }) {
    const payload = { id: user.id };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      }),
    };
  }
}
