import { IsNotEmpty, IsUUID } from 'class-validator';

export class AnswerQuestionBody {
  @IsUUID()
  @IsNotEmpty()
  game_id: string;

  @IsUUID()
  @IsNotEmpty()
  question_id: string;

  @IsUUID()
  @IsNotEmpty()
  question_option_id: string;
}
