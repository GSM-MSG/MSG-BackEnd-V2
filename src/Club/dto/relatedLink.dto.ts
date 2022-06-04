import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class RelatedLinkDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string;
}
