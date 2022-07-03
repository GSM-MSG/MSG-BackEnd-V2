import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Club } from './Club.entity';

@Entity({ name: 'image' })
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Club, (club) => club.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @Column()
  url: string;
}
