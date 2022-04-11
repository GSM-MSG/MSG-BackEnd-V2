import { IsString } from 'class-validator';

export class kickUserDto {
  @IsString()
  q: string;
  @IsString()
  type: string;
  @IsString()
  email: string;
}
