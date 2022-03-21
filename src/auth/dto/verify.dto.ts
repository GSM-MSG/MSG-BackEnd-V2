import { IsString } from 'class-validator';

export class VerifyDto {
  @IsString()
  email: string;
}
