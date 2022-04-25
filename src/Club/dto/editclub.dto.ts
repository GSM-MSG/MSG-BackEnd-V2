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
  newMember: string[];

  @IsOptional()
  @IsArray()
  deleteMember: string[];

  @IsOptional()
  @IsObject()
  relatedLink: relatedLinkDto;

  @IsOptional()
  @IsArray()
  newActivityUrls: string[];

  @IsOptional()
  @IsArray()
  deleteActivityUrls: string[];

  @IsOptional()
  @IsArray()
  requetJoin: string[];
}
