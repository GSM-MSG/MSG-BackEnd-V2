import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptUserDto {
  @ApiProperty({
    example: '클라우드 컴퓨팅',
    description: '동아리 이름입니다',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  q: string;

  @ApiProperty({
    example: 'MAJOR',
    description: '동아리 타입입니다',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    example: 's21024',
    description: '신청 한 유저 아이디',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
