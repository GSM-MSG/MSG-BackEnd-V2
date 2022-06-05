import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class KickUserDto {
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  q: string;

  @IsEnum(['MAJOR', 'EDITORIAL', 'FREEDOM'])
  type: 'MAJOR' | 'EDITORIAL' | 'FREEDOM';

  @IsNotEmpty()
  @IsString()
  userId: string;
}
