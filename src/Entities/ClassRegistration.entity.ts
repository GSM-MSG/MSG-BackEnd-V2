import { ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AfterSchool } from './AfterSchool.entity';
import { User } from './User.entity';

export class ClassRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AfterSchool, (AfterSchool) => AfterSchool.id)
  afterSchoolId: AfterSchool;

  @ManyToOne(() => User, (User) => User.email)
  userId: User;
}
