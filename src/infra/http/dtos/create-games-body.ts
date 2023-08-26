import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateGamesBody {
  @IsNumber()
  @IsNotEmpty()
  amount_games: number;

  @IsNumber()
  @Min(1)
  @Max(3)
  game_level: number;

  @IsString()
  @IsNotEmpty()
  group_id: string;
}
