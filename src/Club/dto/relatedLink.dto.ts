import { IsNotEmpty, IsString } from 'class-validator';

export class RelatedLinkDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}
