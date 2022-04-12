import { IsString } from 'class-validator';

export class acceptUserDto {
  @IsString()
  q: string;

  @IsString()
  type: string;

  @IsString()
  userId: string;
}
