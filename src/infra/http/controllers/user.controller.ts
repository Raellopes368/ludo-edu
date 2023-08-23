import { CreateUser } from '@app/use-cases/user/create-user';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserBody } from '../dtos/create-user-body';
import { UserViewModel } from '../view-models/user-view-model';

@Controller('users')
export class UserController {
  constructor(private readonly createUser: CreateUser) {}

  @Post()
  async create(@Body() body: CreateUserBody) {
    const { email, password, name, type, group_id } = body;
    try {
      const { user } = await this.createUser.execute({
        email,
        password,
        name,
        type,
        group_id,
      });

      return {
        user: UserViewModel.toHTTP(user),
      };
    } catch (error: any) {
      throw new HttpException(
        'Não foi possível criar o usuário',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
