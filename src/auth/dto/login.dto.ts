import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 's21024',
    description: '유저 아이디',
    required: true,
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: '12345678',
    description: '유저 비밀번호',
    required: true,
  })
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  password: string;
}
