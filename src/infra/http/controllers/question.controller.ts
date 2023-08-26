import { CreateQuestion } from '@app/use-cases/teacher/create-questions';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateQuestionBody } from '../dtos/create-question-body';
import { QuestionViewModel } from '../view-models/question-view-model';
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import { JWTReqPayload } from 'src/interfaces';

@Controller('questions')
export class QuestionController {
  constructor(private readonly createQuestions: CreateQuestion) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateQuestionBody, @Req() req: JWTReqPayload) {
    const { userId: user_id } = req.user;
    try {
      const { question } = await this.createQuestions.execute({
        ...body,
        user_id,
      });

      return {
        question: QuestionViewModel.toHTTP(question),
      };
    } catch (error: any) {
      throw new HttpException(
        'Não foi possível criar a questão',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
