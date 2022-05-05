import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OauthMobileLoginDto {
  @ApiProperty({
    example: 'GOOGLE_CLIENT_ID',
    description: '해당 플랫폼의 CLIENT ID',
    required: true,
  })
  @IsString()
  clientId: string;

  @ApiProperty({
    example: 'A.B.C',
    description: '모바일 클라이언트에서 OAuth2.0 인증 시 전달되는 유저의 정보',
    required: true,
  })
  @IsString()
  idToken: string;
}
