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
  @IsString()
  teacher: string;

  @IsOptional()
  @IsArray()
  new_member: string[];

  @IsOptional()
  @IsArray()
  delete_member: string[];

  @IsOptional()
  @IsObject()
  relatedLink: relatedLinkDto;

  @IsOptional()
  @IsArray()
  new_activityUrls: string[];

  @IsOptional()
  @IsArray()
  delete_activityUrls: string[];

  @IsOptional()
  @IsArray()
  requetJoin: string[];
}
