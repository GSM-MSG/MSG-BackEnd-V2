import { IsNumber, IsString } from 'class-validator';

export class FindDataDto {
  @IsString()
  name: string;

  @IsString()
  season: string;

  @IsString()
  week: string;

  @IsNumber()
  grade: number;

  @IsString()
  title: string;
}
