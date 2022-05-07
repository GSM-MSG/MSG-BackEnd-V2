import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class OauthMobileLoginDto {
  @ApiProperty({
    example: 'A.B.C',
    description: '모바일 클라이언트에서 OAuth2.0 인증 시 전달되는 유저의 정보',
    required: true,
  })
  @IsJWT()
  idToken: string;
}
