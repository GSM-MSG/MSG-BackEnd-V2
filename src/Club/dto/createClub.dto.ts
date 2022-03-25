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

  @IsString()
  type: string;

  @IsOptional()
  @IsArray()
  relatedLink: relatedLinkDto[];

  @IsOptional()
  @IsString()
  teacher: string;

  @IsOptional()
  @IsArray()
  activitiUrl: string[];

  @IsOptional()
  @IsArray()
  member: string[];
}
