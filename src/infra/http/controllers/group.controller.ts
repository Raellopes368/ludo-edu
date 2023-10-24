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
import { JWTReqPayload, UserType } from 'src/interfaces';
import { ListGroupsParams } from '../dtos/list-groups-params';
import { ListGroups } from '@app/use-cases/teacher/list-groups';
import { AddQuestionsToGroupBody } from '../dtos/add-questions-to-group-body';
import { AddQuestionsToGroup } from '@app/use-cases/teacher/add-questions-to-group';
import { RolesGuard } from '@infra/auth/roles.guard';
import { Roles } from '@infra/auth/roles.decorator';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly createGroup: CreateGroups,
    private listGroups: ListGroups,
    private addQuestionsToGroup: AddQuestionsToGroup,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(UserType.TEACHER)
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
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi possível criar o grupo',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi listar os grupos desse professor',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi listar os grupos desse professor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/add/questions')
  @UseGuards(JwtAuthGuard)
  async addQuestions(
    @Body() body: AddQuestionsToGroupBody,
    @Req() req: JWTReqPayload,
  ) {
    const { group_id, questions_id } = body;
    const { userId: user_id } = req.user;
    try {
      await this.addQuestionsToGroup.execute({
        group_id,
        questions_id,
        user_id,
      });

      return;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi possível adicionar essas questões',
        error.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
