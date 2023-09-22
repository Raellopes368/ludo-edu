import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateUserBody {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Length(6, 28)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsIn([1, 2])
  type: number;

  @IsOptional()
  @IsUUID()
  group_id?: string;
}
