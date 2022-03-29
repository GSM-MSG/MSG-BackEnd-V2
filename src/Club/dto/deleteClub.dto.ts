import { IsString } from 'class-validator';

export class deleteClubdto {
  @IsString()
  q: string;

  @IsString()
  type: string;
}
