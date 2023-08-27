import { IsNotEmpty, IsUUID } from 'class-validator';

export class EnterInGameBody {
  @IsUUID()
  @IsNotEmpty()
  game_id: string;
}
