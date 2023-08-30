import { CreateQuestion } from '@app/use-cases/teacher/create-questions';
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
import { CreateQuestionBody } from '../dtos/create-question-body';
import { QuestionViewModel } from '../view-models/question-view-model';
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import { JWTReqPayload } from 'src/interfaces';
import { GetQuestionToAnswer } from '@app/use-cases/students/get-question-to-answer';

@Controller('questions')
export class QuestionController {
  constructor(
    private readonly createQuestions: CreateQuestion,
    private readonly getQuestionToAnswer: GetQuestionToAnswer,
  ) {}

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

  @Get('/to/answer')
  @UseGuards(JwtAuthGuard)
  async getQuestionToPlay(
    @Query() { game_id }: { game_id: string },
    @Req() req: JWTReqPayload,
  ) {
    const { userId: user_id } = req.user;
    try {
      const { question } = await this.getQuestionToAnswer.execute({
        game_id,
        user_id,
      });

      return {
        question: QuestionViewModel.toHTTP(question),
      };
    } catch (error: any) {
      throw new HttpException(
        error.response || 'Não foi possível buscar uma questão',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
