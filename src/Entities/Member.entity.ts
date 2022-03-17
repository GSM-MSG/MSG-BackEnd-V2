import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Club } from './Club.entity';
import { User } from './User.entity';

@Entity()
export class Member {
  @PrimaryColumn()
  @ManyToOne(() => User, (user) => user.email)
  email: User;

  @PrimaryColumn()
  @ManyToOne(() => Club, (club) => club.id)
  club: Club;
}
