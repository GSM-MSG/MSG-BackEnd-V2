import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'teacher' })
export class Teacher {
  @PrimaryColumn()
  userId: string;

  @Column()
  password: string;
}
