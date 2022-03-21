import { IsString } from 'class-validator';

export class relatedLinkDto {
  @IsString()
  name: string;

  @IsString()
  url: string;
}
