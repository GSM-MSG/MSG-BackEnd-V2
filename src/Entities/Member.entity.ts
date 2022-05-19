import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from './club.entity';
import { User } from './user.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.email, { nullable: true })
  user: User;

  @ManyToOne(() => Club, (club) => club.id, { onDelete: 'CASCADE' })
  club: Club;

  @Column()
  scope: 'MEMBER' | 'HEAD';
}
