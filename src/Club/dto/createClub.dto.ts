import { IsString, IsOptional, IsArray } from 'class-validator';
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

  @IsOptional()
  @IsArray()
  relatedLink: relatedLinkDto;

  @IsOptional()
  @IsString()
  teacher: string;

  @IsOptional()
  @IsArray()
  activities: string[];

  @IsOptional()
  @IsArray()
  member: string[];
}
