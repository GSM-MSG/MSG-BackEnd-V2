import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Club } from './Club.entity';
import { User } from './User.entity';

@Entity()
export class RequestJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Club, (club) => club.id, { onDelete: 'CASCADE' })
  clubId: Club;

  @ManyToOne(() => User, (user) => user.email)
  userId: User;
}
