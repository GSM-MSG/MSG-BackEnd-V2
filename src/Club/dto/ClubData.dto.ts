import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClubDataDto {
  @ApiProperty({
    example: '클라우드 컴퓨팅',
    description: '동아리 이름',
    required: true,
  })
  @IsString()
  q: string;
  @ApiProperty({
    example: 'MAJOR',
    description: '동아리 타입',
    required: true,
  })
  @IsString()
  type: string;
}
