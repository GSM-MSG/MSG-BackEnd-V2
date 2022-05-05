import { IsString } from 'class-validator';

export class OauthMobileLoginDto {
  @IsString()
  clientId: string;

  @IsString()
  idToken: string;
}
