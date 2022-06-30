import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from './Club.entity';
import { User } from './User.entity';

@Entity({ name: 'member' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.email, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Club, (club) => club.id, { onDelete: 'CASCADE' })
  club: Club;

  @Column()
  scope: 'MEMBER' | 'HEAD';
}
