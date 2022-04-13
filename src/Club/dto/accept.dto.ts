import { IsString } from 'class-validator';

export class AcceptUserDto {
  @IsString()
  q: string;

  @IsString()
  type: string;

  @IsString()
  userId: string;
}
