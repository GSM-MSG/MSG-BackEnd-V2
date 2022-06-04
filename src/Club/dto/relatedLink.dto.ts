import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class RelatedLinkDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
