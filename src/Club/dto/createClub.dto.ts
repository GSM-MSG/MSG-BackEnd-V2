import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { relatedLinkDto } from './relatedLink.dto';

export class CreateClubDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  bannerUrl: string;

  @IsString()
  contact: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsObject()
  relatedLink: relatedLinkDto;

  @IsOptional()
  @IsString()
  teacher: string;

  @IsOptional()
  @IsArray()
  activityUrls: string[];

  @IsOptional()
  @IsArray()
  member: string[];
}
