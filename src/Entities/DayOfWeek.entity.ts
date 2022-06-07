import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AfterSchool } from './AfterSchool.entity';

@Entity()
export class DayOfWeek {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AfterSchool, (AfterSchool) => AfterSchool.id)
  afterSchool: AfterSchool;

  @Column()
  dayOfWeek: string;
}
