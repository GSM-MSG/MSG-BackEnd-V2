import { IsNumber } from 'class-validator';

export class ApplyAfterSchoolDto {
  @IsNumber()
  afterSchoolId: number;
}
