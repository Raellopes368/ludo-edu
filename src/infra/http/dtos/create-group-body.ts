import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupBody {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
