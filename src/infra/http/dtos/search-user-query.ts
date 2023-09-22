import { IsOptional, IsString } from 'class-validator';

export class SearchUserQuery {
  @IsString()
  @IsOptional()
  term?: string;
}
