import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClassRegistration } from './ClassRegistration.entity';
import { DayOfWeek } from './DayOfWeek.entity';
import { Grade } from './Grade.entity';

@Entity()
export class AfterSchool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  personnel: number;

  @OneToMany(() => DayOfWeek, (DayOfWeek) => DayOfWeek.id)
  dayOfWeek: DayOfWeek[];

  @OneToMany(() => Grade, (Grade) => Grade.id)
  grade: Grade[];

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
    (ClassRegistration) => ClassRegistration.id,
  )
  classRegistration: ClassRegistration[];
}
