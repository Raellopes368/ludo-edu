import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuestionBody {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsIn([1, 2, 3])
  @IsNotEmpty()
  level: number;

  @IsString()
  @IsNotEmpty()
  group_id: string;
}
