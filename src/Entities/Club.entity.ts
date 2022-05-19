import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './Member.entity';
import { Image } from './Image.entity';
import { RelatedLink } from './RelatedLink.entity';
import { RequestJoin } from './RequestJoin.entity';

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

  @Column({ nullable: true })
  isOpened: boolean;

  @OneToMany(() => Member, (member) => member.club)
  member: Member[];

  @OneToMany(() => RelatedLink, (link) => link.club)
  relatedLink: RelatedLink;

  @OneToMany(() => Image, (Image) => Image.clubId)
  activityUrls: Image[];

  @OneToMany(() => RequestJoin, (RequestJoin) => RequestJoin.clubId)
  requestJoin: RequestJoin[];
}
