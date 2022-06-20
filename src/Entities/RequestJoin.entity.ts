import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from './Club.entity';
import { User } from './User.entity';

@Entity()
export class RequestJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Club, (club) => club.id, { onDelete: 'CASCADE' })
  club: Club;

  @ManyToOne(() => User, (user) => user.email, { onDelete: 'CASCADE' })
  user: User;
}
