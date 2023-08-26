import { CreateGroups } from '@app/use-cases/teacher/create-groups';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateGroupBody } from '../dtos/create-group-body';
import { GroupViewModel } from '../view-models/group-view-model';
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import { JWTReqPayload } from 'src/interfaces';

@Controller('groups')
export class GroupController {
  constructor(private readonly createGroup: CreateGroups) {}

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
}
