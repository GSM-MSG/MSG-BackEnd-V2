import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Club } from './Club.entity';

@Entity()
export class RelatedLink {
  @PrimaryColumn()
  @ManyToOne(() => Club, (club) => club.relatedLink)
  id: Club;

  @Column()
  name: string;

  @Column()
  url: string;
}
