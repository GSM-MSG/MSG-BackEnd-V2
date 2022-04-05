import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Club } from './Club.entity';
import { User } from './User.entity';

@Entity()
export class RequestJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Club, (Club) => Club.id)
  @JoinColumn({ name: 'clubId' })
  clubId: Club;

  @ManyToOne(() => User, (User) => User.email)
  @JoinColumn({ name: 'userId' })
  userId: User;
}
