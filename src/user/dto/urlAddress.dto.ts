import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UrlDto {
  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/81404026?v=4',
    description: 'urlRink',
    required: true,
  })
  @IsString()
  url: string;
}
