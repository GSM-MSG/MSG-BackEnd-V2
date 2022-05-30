import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ListDataDto {
  @IsString()
  season: string;

  @IsString()
  week: string;

  @Type(() => Number)
  @IsNumber()
  grade: number;
}
