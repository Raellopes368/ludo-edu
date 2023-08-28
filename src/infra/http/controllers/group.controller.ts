import { CreateGroups } from '@app/use-cases/teacher/create-groups';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateGroupBody } from '../dtos/create-group-body';
import { GroupViewModel } from '../view-models/group-view-model';
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import { JWTReqPayload } from 'src/interfaces';
import { ListGroupsParams } from '../dtos/list-groups-params';
import { ListGroups } from '@app/use-cases/teacher/list-groups';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly createGroup: CreateGroups,
    private listGroups: ListGroups,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateGroupBody, @Req() req: JWTReqPayload) {
    const { description, name } = body;
    const { userId } = req.user;
    try {
      const { group } = await this.createGroup.execute({
        name,
        description,
        teacher_owner_user_id: userId,
      });

      return {
        group: GroupViewModel.toHTTP(group),
      };
    } catch (error: any) {
      throw new HttpException(
        'Não foi possível criar o grupo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/list/:teacher_id')
  async listByTeacher(@Param() { teacher_id }: ListGroupsParams) {
    try {
      const { groups } = await this.listGroups.execute({ user_id: teacher_id });

      return {
        groups: groups.map((group) => GroupViewModel.toHTTP(group)),
      };
    } catch (error: any) {
      throw new HttpException(
        'Não foi listar os grupos desse professor',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  async list(@Req() req: JWTReqPayload) {
    try {
      const { userId: user_id } = req.user;
      const { groups } = await this.listGroups.execute({ user_id });

      return {
        groups: groups.map((group) => GroupViewModel.toHTTP(group)),
      };
    } catch (error: any) {
      throw new HttpException(
        'Não foi listar os grupos desse professor',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
