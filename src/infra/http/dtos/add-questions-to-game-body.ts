import { IsArray, IsNotEmpty, IsNotIn, IsString } from 'class-validator';

export class AddQuestionsToGameBody {
  @IsString()
  @IsNotEmpty()
  game_id: string;

  @IsArray()
  @IsNotIn([''])
  questions_id: string[];
}
