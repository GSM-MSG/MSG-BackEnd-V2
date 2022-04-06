import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  @MaxLength(20)
  @MinLength(8)
  password: string;
}
