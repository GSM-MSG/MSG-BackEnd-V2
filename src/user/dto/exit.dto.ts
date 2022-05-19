import { IsString } from 'class-validator';

export class ExitDataDto {
  @IsString()
  name: string;

  @IsString()
  type: string;
}
