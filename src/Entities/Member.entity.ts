import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from './Club.entity';
import { User } from './User.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.email)
  email: User;

  @ManyToOne(() => Club, (club) => club.id)
  club: Club;

  @Column()
  scope: 'MEMBER' | 'HEAD';
}
