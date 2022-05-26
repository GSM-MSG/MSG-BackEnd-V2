import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClassRegistration } from './ClassRegistration.entity';

export class AfterSchool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  personnel: number;

  @Column()
  week: string;

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
  year: number;

  @OneToMany(
    () => ClassRegistration,
    (ClassRegistration) => ClassRegistration.afterSchool,
  )
  classRegistration: ClassRegistration[];
}
