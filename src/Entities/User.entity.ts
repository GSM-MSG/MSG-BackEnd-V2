import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { ClassRegistration } from './ClassRegistration.entity';
import { Member } from './Member.entity';
import { RequestJoin } from './RequestJoin.entity';

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

  @OneToMany(() => RequestJoin, (RequestJoin) => RequestJoin.user)
  requestJoin: RequestJoin[];

  @OneToMany(
    () => ClassRegistration,
    (ClassRegistration) => ClassRegistration.id,
  )
  classRegistration: ClassRegistration[];

  @Column({ nullable: true })
  refreshToken: string | null;
}
