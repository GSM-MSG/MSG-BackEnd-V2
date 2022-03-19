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

  @Column({ nullable: true })
  userImg: string;

  @OneToMany(() => Member, (member) => member.email)
  member: Member[];

  @Column({ nullable: true })
  isVerified: string | null;
}
