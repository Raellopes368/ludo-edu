import { IsNotEmpty, IsUUID } from 'class-validator';

export class ListGroupsParams {
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;
}
