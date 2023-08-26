import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateQuestionOptionBody {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @Min(0)
  @Max(6)
  @IsNotEmpty()
  points: number;
}
