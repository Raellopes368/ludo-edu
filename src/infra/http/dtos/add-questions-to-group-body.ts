import { IsArray, IsNotEmpty, IsNotIn, IsString } from 'class-validator';

export class AddQuestionsToGroupBody {
  @IsString()
  @IsNotEmpty()
  group_id: string;

  @IsArray()
  @IsNotIn([''])
  questions_id: string[];
}
