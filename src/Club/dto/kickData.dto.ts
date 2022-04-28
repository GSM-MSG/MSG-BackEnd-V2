import { IsString } from 'class-validator';

export class clubUserDto {
  @IsString()
  q: string;
  @IsString()
  type: string;
  @IsString()
  email: string;
}
