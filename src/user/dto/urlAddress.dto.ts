import { IsString } from 'class-validator';

export class urlDto {
  @IsString()
  url: string;
}
