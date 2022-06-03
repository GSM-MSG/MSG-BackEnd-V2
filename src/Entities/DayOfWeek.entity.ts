import { IsString } from 'class-validator';
import { ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AfterSchool } from './AfterSchool.entity';

export class DayOfWeek {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AfterSchool, (AfterSchool) => AfterSchool.id)
  afterSchool: AfterSchool;

  @IsString()
  dayOfWeek: string;
}
