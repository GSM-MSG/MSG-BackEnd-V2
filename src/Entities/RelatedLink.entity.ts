import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from './Club.entity';

@Entity()
export class RelatedLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @OneToMany(() => Club, (club) => club.id, { onDelete: 'CASCADE' })
  club: Club;
}
