import { CreateUser } from '@app/use-cases/user/create-user';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserBody } from '../dtos/create-user-body';
import { UserViewModel } from '../view-models/user-view-model';
import { SearchUsers } from '@app/use-cases/user/search-users';
import { SearchUserQuery } from '../dtos/search-user-query';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly searchUsers: SearchUsers,
  ) {}

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

  @Get('/search')
  async search(@Query() { term = '' }: SearchUserQuery) {
    try {
      const { users } = await this.searchUsers.execute({ term });

      return {
        users: users.map((user) => UserViewModel.toHTTP(user)),
      };
    } catch (err) {
      throw new HttpException(
        'Houve um erro ao listar usuários',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
