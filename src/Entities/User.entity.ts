import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Member } from './Member.entity';

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  grade: number;

  @Column()
  class: number;

  @Column()
  num: number;

  @Column()
  userImg: string;

  @OneToMany(() => Member, (member) => member.email)
  member: Member;
}
