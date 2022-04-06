import { IsString, MaxLength, MinLength } from 'class-validator';

export class verifyHeadDto {
  @IsString()
  email: string;

  @IsString()
  @MaxLength(4)
  @MinLength(4)
  code: string;
}
