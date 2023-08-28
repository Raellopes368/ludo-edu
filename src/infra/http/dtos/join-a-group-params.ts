import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinAGroupParams {
  @IsUUID()
  @IsNotEmpty()
  group_id: string;
}
