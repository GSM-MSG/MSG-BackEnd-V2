import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { RequestJoin } from 'src/Entities/RequestJoin.entity';
import { relatedLinkDto } from './relatedLink.dto';

export class editClubdto {
  @IsString()
  q: string;

  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsString()
  bannerUrl: string;

  @IsString()
  title: string;

  @IsString()
  contact: string;

  @IsOptional()
  @IsBoolean()
  isOpened: Boolean;

  @IsOptional()
  @IsString()
  teacher: string;

  @IsOptional()
  @IsArray()
  member: string[];

  @IsOptional()
  @IsObject()
  relatedLink: relatedLinkDto;

  @IsOptional()
  @IsArray()
  activityUrls: string[];

  @IsOptional()
  @IsArray()
  requetJoin: string[];
}
