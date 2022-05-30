import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ListDataDto {
  @Type(() => String)
  @IsString()
  season: string;

  @Type(() => String)
  @IsString()
  week: string;

  @Type(() => Number)
  @IsNumber()
  grade: number;
}
