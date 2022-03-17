import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  photo: string;
}
