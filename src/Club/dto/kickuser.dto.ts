import { IsNotEmpty, IsString } from 'class-validator';

export class KickUserDto {
  @IsNotEmpty()
  @IsString()
  q: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
