import { CreateQuestionOptions } from '@app/use-cases/teacher/create-question-options';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateQuestionOptionBody } from '../dtos/create-question-option-body';
import { QuestionOptionViewModel } from '../view-models/question-option-view-model';
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import { JWTReqPayload } from 'src/interfaces';

@Controller('questions/options')
export class QuestionOptionController {
  constructor(private readonly createQuestionOptions: CreateQuestionOptions) {}

  @Post('/:question_id')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: CreateQuestionOptionBody[],
    @Req() req: JWTReqPayload,
    @Param() { question_id }: { question_id: string },
  ) {
    const { userId: user_id } = req.user;

    try {
      const { questionOptions } = await this.createQuestionOptions.execute({
        options: body,
        question_id,
        user_id,
      });

      return {
        questionOptions: questionOptions.map((option) =>
          QuestionOptionViewModel.toHTTP(option, true),
        ),
      };
    } catch (error: any) {
      throw new HttpException(
        'Não foi possível criar as opções',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
