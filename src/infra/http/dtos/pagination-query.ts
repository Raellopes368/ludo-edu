import { IsOptional, IsString } from 'class-validator';

export class PaginationQuery {
  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  per_page: string;
}
