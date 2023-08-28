import { IsNotEmpty, IsUUID } from 'class-validator';

export class ListGamesByGroupParams {
  @IsUUID()
  @IsNotEmpty()
  group_id: string;
}
