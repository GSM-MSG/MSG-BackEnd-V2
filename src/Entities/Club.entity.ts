import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { image } from './image.entity';
import { RelatedLink } from './RelatedLink.entity';

@Entity()
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

  @Column({ nullable: true })
  description: string;

  @Column()
  contact: string;

  @Column({ nullable: true })
  teacher: string;

  @Column({ nullable: true })
  @OneToMany(() => RelatedLink, (link) => link.id)
  relatedLink: string[];

  @Column({ nullable: true })
  activitiesUrl: string[];

  @Column({ nullable: true })
  clubMember: string[];

  @OneToMany(() => image, (image) => image.clubId)
  image: image;
}
