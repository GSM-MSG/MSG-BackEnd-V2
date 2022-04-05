import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './Member.entity';
import { Image } from './image.entity';
import { RelatedLink } from './RelatedLink.entity';

@Entity()
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  bannerUrl: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  contact: string;

  @Column({ nullable: true })
  teacher: string;

  @OneToMany(() => Member, (member) => member.club)
  member: Member[];

  @OneToMany(() => RelatedLink, (link) => link.id)
  relatedLink: RelatedLink;

  @OneToMany(() => Image, (Image) => Image.clubId)
  activityUrls: Image[];
}
