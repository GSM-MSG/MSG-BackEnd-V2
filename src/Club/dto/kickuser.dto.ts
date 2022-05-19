import { IsString } from 'class-validator';

export class KickUserDto {
  @IsString()
  q: string;
  @IsString()
  type: string;
  @IsString()
  userId: string;
}
