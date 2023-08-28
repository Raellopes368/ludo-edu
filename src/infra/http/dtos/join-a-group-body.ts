import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinAGroupBody {
  @IsUUID()
  @IsNotEmpty()
  group_id: string;
}
