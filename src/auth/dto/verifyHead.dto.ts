import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class verifyHeadDto {
  @ApiProperty({
    example: 's21024',
    description: '유저 이메일',
    required: true,
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: '1234',
    description: '인증코드',
    required: true,
  })
  @IsString()
  @MaxLength(4)
  @MinLength(4)
  code: string;
}
