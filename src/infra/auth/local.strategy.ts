import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuth } from '@app/use-cases/auth/create-auth';
import { UserViewModel } from '@infra/http/view-models/user-view-model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private createAuth: CreateAuth) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const { user } = await this.createAuth.execute({ email, password });
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      user: UserViewModel.toHTTP(user),
    };
  }
}
