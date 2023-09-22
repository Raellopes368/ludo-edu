import { UserRepository } from '@app/repositories/UserRepository';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { jwtConstants } from './constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest<any>();
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      const decodedToken: any = jwt.verify(token, jwtConstants.secret);
      const user = await this.userRepository.findByUserId(decodedToken.id);
      if (!user || !roles.includes(user.type)) {
        throw new HttpException('Acesso não autorizado', HttpStatus.FORBIDDEN);
      }
      return true;
    } catch (err: any) {
      throw new HttpException(
        err.response || 'Houve algum erro, tente novamente',
        err.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
