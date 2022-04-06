import { IsString } from 'class-validator';

export class findClubDto {
  @IsString()
  title: string;

  @IsString()
  type: string;
}
