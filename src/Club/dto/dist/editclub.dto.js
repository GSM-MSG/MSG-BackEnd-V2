"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EditClubDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var EditClubDto = /** @class */ (function () {
    function EditClubDto() {
    }
    __decorate([
        swagger_1.ApiProperty({
            example: '클라우드 컴퓨팅',
            description: '수정할 동아리 이름',
            required: true
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.MaxLength(20),
        class_validator_1.IsString()
    ], EditClubDto.prototype, "q");
    __decorate([
        swagger_1.ApiProperty({
            example: 'MAJOR',
            description: '동아리 타입',
            required: true
        }),
        class_validator_1.IsEnum(['MAJOR', 'EDITORIAL', 'FREEDOM'])
    ], EditClubDto.prototype, "type");
    __decorate([
        swagger_1.ApiProperty({
            example: '클라우드 컴퓨팅은 ~~~~',
            description: '수정할 동아리 문구',
            required: true
        }),
        class_validator_1.IsString()
    ], EditClubDto.prototype, "description");
    __decorate([
        swagger_1.ApiProperty({
            example: 'https://avatars.githubusercontent.com/u/81404026?v=4',
            description: '동아리 홍보 뒷 사진',
            required: true
        }),
        class_validator_1.IsUrl({ require_protocol: true, require_valid_protocol: true }),
        class_validator_1.IsString()
    ], EditClubDto.prototype, "bannerUrl");
    __decorate([
        swagger_1.ApiProperty({
            example: '클라우드',
            description: '바뀔 이름',
            required: true
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.MaxLength(20),
        class_validator_1.IsString()
    ], EditClubDto.prototype, "title");
    __decorate([
        swagger_1.ApiProperty({
            example: '김시훈#7880',
            description: '연락처입니다',
            required: true
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], EditClubDto.prototype, "contact");
    __decorate([
        swagger_1.ApiProperty({
            example: '김민영 선생님',
            description: '동아리 담당 선생님 이름입니다',
            required: true
        }),
        class_validator_1.IsOptional(),
        class_validator_1.MaxLength(5),
        class_validator_1.IsString()
    ], EditClubDto.prototype, "teacher");
    __decorate([
        swagger_1.ApiProperty({
            example: '노션링크',
            description: '동아리 홍보 링크입니다',
            required: true
        }),
        class_validator_1.IsUrl(),
        class_validator_1.IsString()
    ], EditClubDto.prototype, "notionLink");
    __decorate([
        swagger_1.ApiProperty({
            example: [
                'https://avatars.githubusercontent.com/u/81404026?v=4',
                'https://avatars.githubusercontent.com/u/81404026?v=4',
            ],
            description: '추가할 동아리 활동 사진입니다',
            required: true
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsArray()
    ], EditClubDto.prototype, "newActivityUrls");
    __decorate([
        swagger_1.ApiProperty({
            example: [
                'https://avatars.githubusercontent.com/u/81404026?v=4',
                'https://avatars.githubusercontent.com/u/81404026?v=4',
            ],
            description: ' 동아리 활동 사진입니다',
            required: true
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsArray()
    ], EditClubDto.prototype, "deleteActivityUrls");
    return EditClubDto;
}());
exports.EditClubDto = EditClubDto;
