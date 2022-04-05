import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from './Club.entity';
import { User } from './User.entity';

@Entity()
export class RequestJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Club, (Club) => Club.id)
  clubId: Club;

  @ManyToOne(() => User, (User) => User.email)
  userId: User;
}
