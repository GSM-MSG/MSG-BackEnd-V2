import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  bannerUrl: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  contact: string;

  @Column()
  teacher: string;

  @Column()
  relatedLink: [];

  @Column()
  activities: [];

  @Column()
  member: [];
}
