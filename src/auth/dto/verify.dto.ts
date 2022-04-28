import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyDto {
  @ApiProperty({
    example: 's21024',
    description: '신청 한 유저 아이디',
    required: true,
  })
  @IsString()
  email: string;
}
