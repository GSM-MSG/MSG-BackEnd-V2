import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClassRegistration } from './ClassRegistration.entity';
import { DayOfWeek } from './DayOfWeek.entity';

@Entity()
export class AfterSchool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  personnel: number;

  @OneToMany(() => DayOfWeek, (DayOfWeek) => DayOfWeek.afterSchool)
  dayOfWeek: DayOfWeek[];

  @Column()
  grade: number;

  @Column()
  teacher: string;

  @Column()
  canDuplicate: boolean;

  @Column()
  isCommon: boolean;

  @Column()
  maxPersonnel: number;

  @Column()
  isFull: boolean;

  @Column()
  season: string;

  @Column()
  yearOf: number;

  @Column()
  isOpened: boolean;

  @OneToMany(
    () => ClassRegistration,
    (ClassRegistration) => ClassRegistration.afterSchool,
  )
  classRegistration: ClassRegistration[];
}
