import { IsString } from 'class-validator';

export class openClubdto {
  @IsString()
  q: string;

  @IsString()
  type: string;
}
