import { IsString } from 'class-validator';

export class ClubDatadto {
  @IsString()
  q: string;

  @IsString()
  type: string;
}
