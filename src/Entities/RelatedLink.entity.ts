import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from './Club.entity';

@Entity()
export class RelatedLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @OneToOne(() => Club, (club) => club.id, { onDelete: 'CASCADE' })
  club: Club;
}
