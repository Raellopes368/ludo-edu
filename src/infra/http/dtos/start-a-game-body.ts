import { IsNotEmpty, IsUUID } from 'class-validator';

export class StartAGameBody {
  @IsUUID()
  @IsNotEmpty()
  game_id: string;
}
