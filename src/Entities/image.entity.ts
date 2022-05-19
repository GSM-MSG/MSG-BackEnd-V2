import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Club } from './club.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Club, (club) => club.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clubId' })
  clubId: number;

  @Column()
  url: string;
}
