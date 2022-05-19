import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { RelatedLinkDto } from './relatedLink.dto';

export class CreateClubDto {
  @ApiProperty({
    example: '클라우드 컴퓨팅',
    description: '동아리 이름',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '여긴 AWS를 공부하는 클라우드 기능반~',
    description: '동아리 설명 한 문장',
    required: true,
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/81404026?v=4',
    description: '동아리 홍보 뒷 사진',
    required: true,
  })
  @IsString()
  bannerUrl: string;

  @ApiProperty({
    example: '김시훈#7880',
    description: '연락처입니다',
    required: true,
  })
  @IsString()
  contact: string;

  @ApiProperty({
    example: 'MAJOR',
    description: '동아리 홍보 뒷 사진',
    required: true,
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: '노션링크',
    description: '동아리 홍보 링크입니다',
    required: true,
  })
  @IsOptional()
  @IsObject()
  relatedLink: RelatedLinkDto;

  @ApiProperty({
    example: '김민영 선생님',
    description: '동아리 담당 선생님 이름입니다',
    required: true,
  })
  @IsOptional()
  @IsString()
  teacher: string;

  @ApiProperty({
    example: [
      'https://avatars.githubusercontent.com/u/81404026?v=4',
      'https://avatars.githubusercontent.com/u/81404026?v=4',
    ],
    description: '동아리 활동 사진입니다',
    required: true,
  })
  @IsOptional()
  @IsArray()
  activityUrls: string[];

  @ApiProperty({
    example: '["s21060","s21024"]',
    description: '동아리 멤버 추가',
    required: true,
  })
  @IsOptional()
  @IsArray()
  member: string[];

  @ApiProperty({
    example: 'true or false',
    description: '동아리 멤버 신청을 받냐 안받냐 입니다',
    required: true,
  })
  @IsOptional()
  @IsBoolean()
  isOpened: Boolean;
}
