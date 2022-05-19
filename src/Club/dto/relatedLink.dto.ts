import { IsString } from 'class-validator';

export class RelatedLinkDto {
  @IsString()
  name: string;

  @IsString()
  url: string;
}
