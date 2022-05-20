import { IsString } from 'class-validator';

export class ClubUserDto {
  @IsString()
  q: string;
  @IsString()
  type: string;
  @IsString()
  userId: string;
}
