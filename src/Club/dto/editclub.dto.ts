import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { RelatedLinkDto } from './relatedLink.dto';

export class EditClubDto {
  @ApiProperty({
    example: '클라우드 컴퓨팅',
    description: '수정할 동아리 이름',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  q: string;

  @ApiProperty({
    example: 'MAJOR',
    description: '동아리 타입',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    example: '클라우드 컴퓨팅은 ~~~~',
    description: '수정할 동아리 문구',
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
    example: '클라우드',
    description: '바뀔 이름',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: '김시훈#7880',
    description: '연락처입니다',
    required: true,
  })
  @IsOptional()
  @IsString()
  contact: string;

  @ApiProperty({
    example: '김민영 선생님',
    description: '동아리 담당 선생님 이름입니다',
    required: true,
  })
  @IsOptional()
  @IsString()
  teacher: string;

  @ApiProperty({
    example: '["s21060","s21024"]',
    description: '동아리 멤버 추가',
    required: true,
  })
  @IsOptional()
  @IsArray()
  newMember: string[];

  @ApiProperty({
    example: '["s21060","s21024"]',
    description: '동아리 멤버 제외',
    required: true,
  })
  @IsOptional()
  @IsArray()
  deleteMember: string[];

  @ApiProperty({
    example: '노션링크',
    description: '동아리 홍보 링크입니다',
    required: true,
  })
  @IsOptional()
  @IsObject()
  relatedLink: RelatedLinkDto;

  @ApiProperty({
    example: [
      'https://avatars.githubusercontent.com/u/81404026?v=4',
      'https://avatars.githubusercontent.com/u/81404026?v=4',
    ],
    description: '추가할 동아리 활동 사진입니다',
    required: true,
  })
  @IsOptional()
  @IsArray()
  newActivityUrls: string[];

  @ApiProperty({
    example: [
      'https://avatars.githubusercontent.com/u/81404026?v=4',
      'https://avatars.githubusercontent.com/u/81404026?v=4',
    ],
    description: ' 동아리 활동 사진입니다',
    required: true,
  })
  @IsOptional()
  @IsArray()
  deleteActivityUrls: string[];
}
