import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Club } from './Club.entity';
import { User } from './User.entity';

@Entity()
export class RequestJoin {
  @PrimaryColumn()
  @ManyToOne(() => User, (User) => User.email)
  userId: User;

  @ManyToOne(() => Club, (Club) => Club.id)
  clubId: Club;
}
