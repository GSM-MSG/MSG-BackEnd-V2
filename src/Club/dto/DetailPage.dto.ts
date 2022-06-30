import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class DetailPageDto {
  @IsNotEmpty()
  @IsString()
  q: string;

  @IsNotEmpty()
  @IsEnum(['MAJOR', 'EDITORIAL', 'FREEDOM'])
  type: 'MAJOR' | 'EDITORIAL' | 'FREEDOM';
}
