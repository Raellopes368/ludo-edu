import { CreateUser } from '@app/use-cases/user/create-user';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserBody } from '../dtos/create-user-body';
import { UserViewModel } from '../view-models/user-view-model';
import { SearchUsers } from '@app/use-cases/user/search-users';
import { SearchUserQuery } from '../dtos/search-user-query';
import { GetUser } from '@app/use-cases/user/get-user';
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import { JWTReqPayload } from 'src/interfaces';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly searchUsers: SearchUsers,
    private readonly getUser: GetUser,
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
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi possível criar o usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        'Houve um erro ao listar usuários',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: JWTReqPayload) {
    try {
      const { userId: user_id } = req.user;
      const { user } = await this.getUser.execute({ user_id });

      return {
        user: UserViewModel.toHTTP(user),
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Houve um erro ao buscar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
