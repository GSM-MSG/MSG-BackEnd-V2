import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AfterSchool } from './AfterSchool.entity';

@Entity({ name: 'grade' })
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AfterSchool, (AfterSchool) => AfterSchool.id, {
    onDelete: 'CASCADE',
  })
  afterSchool: AfterSchool;

  @Column()
  grade: number;
}
