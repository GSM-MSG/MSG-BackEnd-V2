import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class ClubDataDto {
  @ApiProperty({
    example: '클라우드 컴퓨팅',
    description: '동아리 이름',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  q: string;
  @ApiProperty({
    example: 'MAJOR',
    description: '동아리 타입',
    required: true,
  })
  @IsEnum(['MAJOR', 'EDITORIAL', 'FREEDOM'])
  @IsString()
  type: 'MAJOR' | 'EDITORIAL' | 'FREEDOM';
}
