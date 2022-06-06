import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class RelatedLinkDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  url: string;
}
