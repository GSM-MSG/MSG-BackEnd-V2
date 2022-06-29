import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AfterSchool } from './AfterSchool.entity';
import { User } from './User.entity';

@Entity({ name: 'classRegistration' })
export class ClassRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AfterSchool, (AfterSchool) => AfterSchool.id)
  afterSchool: AfterSchool;

  @ManyToOne(() => User, (User) => User.email, { onDelete: 'CASCADE' })
  user: User;
}
