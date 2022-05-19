import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Member } from './member.entity';
import { RequestJoin } from './requestJoin.entity';

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  name: string;

  @Column()
  grade: number;

  @Column()
  class: number;

  @Column()
  num: number;

  @Column({ nullable: true })
  userImg: string;

  @OneToMany(() => Member, (member) => member.user)
  member: Member[];

  @OneToMany(() => RequestJoin, (RequestJoin) => RequestJoin.userId)
  requestJoin: RequestJoin[];

  @Column({ nullable: true })
  refreshToken: string | null;
}
