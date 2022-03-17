import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Club } from './Club.entity';
import { User } from './User.entity';

@Entity()
export class RequestJoin {
  @OneToOne(() => User, (User) => User.email)
  userId: string;

  @OneToMany(() => Club, (Club) => Club.id)
  clubId: number;
}
