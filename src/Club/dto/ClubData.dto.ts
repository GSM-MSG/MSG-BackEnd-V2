import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ClubDataDto {
  @ApiProperty({
    example: '클라우드 컴퓨팅',
    description: '동아리 이름',
    required: true,
  })
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  q: string;
  @ApiProperty({
    example: 'MAJOR',
    description: '동아리 타입',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(['MAJOR', 'EDITORIAL', 'FREEDOM'])
  type: 'MAJOR' | 'EDITORIAL' | 'FREEDOM';
}
