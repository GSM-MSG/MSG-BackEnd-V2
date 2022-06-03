import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class FindDataDto {
  @IsString()
  season: string;

  @IsString()
  week: string;

  @Type(() => Number)
  @IsNumber()
  grade: number;

  @IsString()
  title: string;
}
