import { IsString } from 'class-validator';

export class exitDataDto {
  @IsString()
  name: string;

  @IsString()
  type: string;
}
