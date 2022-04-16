import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './Member.entity';
import { Image } from './image.entity';
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

  @OneToOne(() => RelatedLink, (link) => link.club)
  @JoinColumn()
  relatedLink: RelatedLink;

  @OneToMany(() => Image, (Image) => Image.clubId)
  activityUrls: Image[];

  @OneToMany(() => RequestJoin, (RequestJoin) => RequestJoin.clubId)
  requestJoin: RequestJoin[];
}
