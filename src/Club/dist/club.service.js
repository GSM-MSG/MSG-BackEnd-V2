"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ClubService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var Club_entity_1 = require("src/Entities/Club.entity");
var image_entity_1 = require("src/Entities/image.entity");
var Member_entity_1 = require("src/Entities/Member.entity");
var RequestJoin_entity_1 = require("src/Entities/RequestJoin.entity");
var User_entity_1 = require("src/Entities/User.entity");
var ClubService = /** @class */ (function () {
    function ClubService(Club, Member, User, Image, RequestJoin) {
        this.Club = Club;
        this.Member = Member;
        this.User = User;
        this.Image = Image;
        this.RequestJoin = RequestJoin;
    }
    ClubService.prototype.list = function (clubType) {
        return __awaiter(this, void 0, void 0, function () {
            var clubData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!clubType) {
                            throw new common_1.HttpException('동아리타입이 없습니다.', common_1.HttpStatus.BAD_REQUEST);
                        }
                        if (!(clubType === 'MAJOR' || 'EDITORIAL' || 'FREEDOM')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.Club.find({
                                where: { type: clubType },
                                select: ['type', 'title', 'bannerUrl']
                            })];
                    case 1:
                        clubData = _a.sent();
                        return [2 /*return*/, clubData];
                    case 2: throw new common_1.HttpException('동아리타입이 잘못되었습니다.', common_1.HttpStatus.BAD_REQUEST);
                }
            });
        });
    };
    ClubService.prototype.createClub = function (createClubData, email) {
        return __awaiter(this, void 0, void 0, function () {
            var title, description, bannerUrl, contact, teacher, type, notionLink, member, activityUrls, userData, checkUser, check, isOpened, clubData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        title = createClubData.title, description = createClubData.description, bannerUrl = createClubData.bannerUrl, contact = createClubData.contact, teacher = createClubData.teacher, type = createClubData.type, notionLink = createClubData.notionLink, member = createClubData.member, activityUrls = createClubData.activityUrls;
                        return [4 /*yield*/, this.User.findOne({
                                where: { email: email }
                            })];
                    case 1:
                        userData = _a.sent();
                        return [4 /*yield*/, this.Member.find({
                                where: { user: userData },
                                relations: ['club']
                            })];
                    case 2:
                        checkUser = _a.sent();
                        return [4 /*yield*/, this.Club.findOne({ where: { title: title, type: type } })];
                    case 3:
                        if (_a.sent()) {
                            throw new common_1.HttpException('이미 존재하는 동아리입니다', common_1.HttpStatus.CONFLICT);
                        }
                        check = checkUser.filter(function (member) {
                            return member.club.type === type;
                        });
                        if (check[0]) {
                            throw new common_1.HttpException('이미 동아리를 만든 유저입니다.', common_1.HttpStatus.BAD_REQUEST);
                        }
                        if (!email) {
                            throw new common_1.HttpException('이메일이 존재하지 않습니다.', common_1.HttpStatus.UNAUTHORIZED);
                        }
                        isOpened = false;
                        return [4 /*yield*/, this.Club.save(this.Club.create({
                                title: title,
                                description: description,
                                bannerUrl: bannerUrl,
                                contact: contact,
                                teacher: teacher,
                                type: type,
                                isOpened: isOpened,
                                notionLink: notionLink
                            }))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.Club.findOne({
                                where: { title: title, type: type }
                            })];
                    case 5:
                        clubData = _a.sent();
                        if (!clubData) {
                            throw new common_1.HttpException('동아리가 존재하지 않습니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        return [4 /*yield*/, this.Member.save(this.Member.create({ user: userData, club: clubData, scope: 'HEAD' }))];
                    case 6:
                        _a.sent();
                        if (member) {
                            member.forEach(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                var userData, checkMember, check;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.User.findOne({ where: { email: user } })];
                                        case 1:
                                            userData = _a.sent();
                                            return [4 /*yield*/, this.Member.find({
                                                    where: { user: userData },
                                                    relations: ['club']
                                                })];
                                        case 2:
                                            checkMember = _a.sent();
                                            check = checkMember.filter(function (member) {
                                                return member.club.type === type;
                                            });
                                            if (!!check) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this.Member.save(this.Member.create({
                                                    user: userData,
                                                    club: clubData,
                                                    scope: 'MEMBER'
                                                }))];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        if (activityUrls) {
                            activityUrls.forEach(function (image) {
                                _this.Image.save({ club: clubData.id, url: image });
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ClubService.prototype.deleteClub = function (clubtitle, clubType, email) {
        return __awaiter(this, void 0, void 0, function () {
            var clubData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Club.findOne({
                            where: { title: clubtitle, type: clubType },
                            relations: ['member', 'member.user']
                        })];
                    case 1:
                        clubData = _a.sent();
                        if (!clubData.member.find(function (member) {
                            return member.user.email === email && member.scope === 'HEAD';
                        })) {
                            throw new common_1.HttpException('동아리 부장이 아닙니다.', common_1.HttpStatus.FORBIDDEN);
                        }
                        if (!email) {
                            throw new common_1.HttpException('이메일이 존재하지 않습니다.', common_1.HttpStatus.UNAUTHORIZED);
                        }
                        if (!clubData) {
                            throw new common_1.HttpException('존재하지않는 동아리입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        if (!(clubType === 'MAJOR' || 'EDITORIAL' || 'FREEDOM')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.Club["delete"]({ title: clubtitle, type: clubType })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new common_1.HttpException('잘못된 동아리 유형입니다.', common_1.HttpStatus.BAD_REQUEST);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ClubService.prototype.applyClub = function (type, title, email) {
        return __awaiter(this, void 0, void 0, function () {
            var findOthers, clubData, userData, checkApply, checkOtherclub;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Club.findOne({
                            where: { type: type, title: title }
                        })];
                    case 1:
                        clubData = _a.sent();
                        if (!clubData) {
                            throw new common_1.HttpException('존재하지 않는 동아리입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        return [4 /*yield*/, this.User.findOne({
                                where: { email: email },
                                relations: ['requestJoin', 'requestJoin.club', 'member', 'member.club']
                            })];
                    case 2:
                        userData = _a.sent();
                        if (!userData) {
                            throw new common_1.HttpException('존재하지 않는 유저입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        checkApply = userData.requestJoin.filter(function (requestJoin) {
                            return requestJoin.club.id === clubData.id;
                        });
                        if (checkApply[0]) {
                            throw new common_1.HttpException('이미 이 동아리에 가입신청을 하였습니다.', common_1.HttpStatus.CONFLICT);
                        }
                        if (userData.member[0] && type !== 'EDITORIAL') {
                            findOthers = userData.member.filter(function (member) {
                                return member.club.id !== clubData.id;
                            });
                        }
                        if (findOthers[0]) {
                            throw new common_1.HttpException('다른 동아리에 소속되어있습니다.', common_1.HttpStatus.CONFLICT);
                        }
                        checkOtherclub = userData.requestJoin.filter(function (member) {
                            return member.club.type !== 'EDITORIAL' && member.club.id !== clubData.id;
                        });
                        if (checkOtherclub[0] && type !== 'EDITORIAL') {
                            throw new common_1.HttpException('이미 다른 동아리에 지원한 상태입니다.', common_1.HttpStatus.CONFLICT);
                        }
                        this.RequestJoin.save(this.RequestJoin.create({ club: clubData, user: userData }));
                        return [2 /*return*/];
                }
            });
        });
    };
    ClubService.prototype.cancelClub = function (clubtype, clubtitle, email) {
        return __awaiter(this, void 0, void 0, function () {
            var clubData, userData, applyUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Club.findOne({
                            where: { type: clubtype, title: clubtitle }
                        })];
                    case 1:
                        clubData = _a.sent();
                        return [4 /*yield*/, this.User.findOne({ where: { email: email } })];
                    case 2:
                        userData = _a.sent();
                        if (!email) {
                            throw new common_1.HttpException('이메일이 존재하지 않습니다.', common_1.HttpStatus.UNAUTHORIZED);
                        }
                        if (!clubData) {
                            throw new common_1.HttpException('존재하지않는 동아리입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        if (!userData) {
                            throw new common_1.HttpException('존재하지않는 유저입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        return [4 /*yield*/, this.RequestJoin.findOne({
                                where: { club: clubData, user: userData }
                            })];
                    case 3:
                        applyUser = _a.sent();
                        return [4 /*yield*/, this.RequestJoin["delete"](__assign({}, applyUser))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClubService.prototype.acceptClub = function (type, title, email, headId) {
        return __awaiter(this, void 0, void 0, function () {
            var findOthers, clubData, userData, checkJoin, acceptUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Club.findOne({
                            where: { type: type, title: title },
                            relations: ['member', 'member.user']
                        })];
                    case 1:
                        clubData = _a.sent();
                        if (!clubData) {
                            throw new common_1.HttpException('존재하지 않는 동아리입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        return [4 /*yield*/, this.User.findOne({
                                where: { email: email },
                                relations: ['member', 'member.club']
                            })];
                    case 2:
                        userData = _a.sent();
                        if (!userData) {
                            throw new common_1.HttpException('존재하지 않는 유저입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        checkJoin = userData.member.filter(function (member) {
                            return member.club.id === clubData.id;
                        });
                        if (userData.member[0] && type !== 'EDITORIAL') {
                            findOthers = userData.member.find(function (member) {
                                return (member.club.type === type && member.club.title !== clubData.title);
                            });
                        }
                        if (checkJoin[0]) {
                            throw new common_1.HttpException('이미 동아리에 가입되어있는 유저입니다.', common_1.HttpStatus.CONFLICT);
                        }
                        if (findOthers && type !== 'EDITORIAL') {
                            throw new common_1.HttpException('다른 동아리에 가입된 유저입니다.', common_1.HttpStatus.CONFLICT);
                        }
                        if (!clubData.member.filter(function (member) {
                            return member.user.email === headId && member.scope === 'HEAD';
                        })) {
                            throw new common_1.HttpException('동아리부장이 아닙니다.', common_1.HttpStatus.FORBIDDEN);
                        }
                        return [4 /*yield*/, this.RequestJoin.findOne({
                                where: { club: clubData, user: userData }
                            })];
                    case 3:
                        acceptUser = _a.sent();
                        return [4 /*yield*/, this.RequestJoin["delete"](acceptUser)];
                    case 4:
                        _a.sent();
                        this.Member.save({ club: clubData, user: userData, scope: 'MEMBER' });
                        return [2 /*return*/];
                }
            });
        });
    };
    ClubService.prototype.rejectClub = function (clubtype, clubtitle, rejectUserId, email) {
        return __awaiter(this, void 0, void 0, function () {
            var clubData, userData, rejectUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Club.findOne({
                            where: { type: clubtype, title: clubtitle },
                            relations: ['member', 'member.user']
                        })];
                    case 1:
                        clubData = _a.sent();
                        return [4 /*yield*/, this.User.findOne({
                                where: { email: rejectUserId }
                            })];
                    case 2:
                        userData = _a.sent();
                        if (!email) {
                            throw new common_1.HttpException('이메일이 존재하지 않습니다.', common_1.HttpStatus.UNAUTHORIZED);
                        }
                        if (!clubData) {
                            throw new common_1.HttpException('존재하지 않는 동아리입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        if (!clubData.member.filter(function (member) {
                            return member.user.email === email && member.scope == 'HEAD';
                        })) {
                            throw new common_1.HttpException('동아리부장이 아닙니다.', common_1.HttpStatus.FORBIDDEN);
                        }
                        return [4 /*yield*/, this.RequestJoin.findOne({
                                where: { club: clubData, user: userData }
                            })];
                    case 3:
                        rejectUser = _a.sent();
                        return [4 /*yield*/, this.RequestJoin["delete"](__assign({}, rejectUser))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClubService.prototype.applicantList = function (clubType, clubtitle, email) {
        return __awaiter(this, void 0, void 0, function () {
            var reqUserData, userScope, requestUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Club.findOne({
                            relations: ['requestJoin', 'requestJoin.user', 'member', 'member.user'],
                            where: { title: clubtitle, type: clubType }
                        })];
                    case 1:
                        reqUserData = _a.sent();
                        if (!email) {
                            throw new common_1.HttpException('이메일이 존재하지 않습니다.', common_1.HttpStatus.UNAUTHORIZED);
                        }
                        if (!reqUserData) {
                            throw new common_1.HttpException('동아리가 존재하지 않습니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        if (!reqUserData.member.find(function (member) {
                            return member.user.email === email;
                        })) {
                            throw new common_1.HttpException('동아리원이 아닙니다.', common_1.HttpStatus.NOT_ACCEPTABLE);
                        }
                        userScope = reqUserData.member.find(function (member) {
                            return member.user.email === email;
                        }).scope;
                        requestUser = reqUserData.requestJoin.map(function (member) {
                            delete member.user.refreshToken;
                            return member.user;
                        });
                        return [2 /*return*/, { requestUser: requestUser, userScope: userScope }];
                }
            });
        });
    };
    ClubService.prototype.detailPage = function (clubtype, clubtitle, email) {
        return __awaiter(this, void 0, void 0, function () {
            var club, userData, head, clubMembers, activityurls, applicant, isApplied, memberForScope, scope;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Club.findOne({
                            where: { type: clubtype, title: clubtitle },
                            relations: ['activityUrls', 'member', 'member.user'],
                            select: {
                                id: true,
                                title: true,
                                type: true,
                                bannerUrl: true,
                                description: true,
                                contact: true,
                                teacher: true,
                                notionLink: true,
                                isOpened: true,
                                member: {
                                    id: true,
                                    user: {
                                        email: true,
                                        name: true,
                                        grade: true,
                                        "class": true,
                                        num: true,
                                        userImg: true
                                    },
                                    scope: true
                                },
                                activityUrls: { id: true, url: true }
                            }
                        })];
                    case 1:
                        club = _a.sent();
                        if (!email) {
                            throw new common_1.HttpException('이메일이 존재하지 않습니다.', common_1.HttpStatus.UNAUTHORIZED);
                        }
                        return [4 /*yield*/, this.User.findOne({ where: { email: email } })];
                    case 2:
                        userData = _a.sent();
                        if (!club) {
                            throw new common_1.HttpException('존재하지않는 동아리입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        head = club.member.find(function (member) {
                            return member.scope === 'HEAD';
                        });
                        clubMembers = club.member.filter(function (member) {
                            return member.scope === 'MEMBER';
                        });
                        if (!club.activityUrls) return [3 /*break*/, 4];
                        activityurls = club.activityUrls.map(function (url) {
                            return url.url;
                        });
                        return [4 /*yield*/, this.RequestJoin.findOne({
                                where: { user: userData, club: club }
                            })];
                    case 3:
                        applicant = _a.sent();
                        isApplied = !!applicant;
                        memberForScope = club.member.find(function (member) {
                            return member.user.email === userData.email;
                        });
                        scope = memberForScope ? memberForScope.scope : 'USER';
                        delete club.member;
                        delete club.activityUrls;
                        return [2 /*return*/, {
                                club: club,
                                activityurls: activityurls,
                                head: head.user,
                                member: clubMembers.map(function (user) {
                                    return user.user;
                                }),
                                scope: scope,
                                isApplied: isApplied
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ClubService.prototype.findMember = function (clubType, clubTitle, email) {
        return __awaiter(this, void 0, void 0, function () {
            var clubData, user, requestUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!email)
                            throw new common_1.UnauthorizedException('이메일이 존재하지 않습니다.');
                        return [4 /*yield*/, this.Club.findOne({
                                where: { title: clubTitle, type: clubType },
                                relations: ['member', 'member.user']
                            })];
                    case 1:
                        clubData = _a.sent();
                        user = clubData.member.find(function (member) {
                            return member.user.email === email;
                        });
                        if (!user)
                            throw new common_1.NotAcceptableException('동아리 원이 아닙니다');
                        requestUser = clubData.member.map(function (member) {
                            delete member.user.refreshToken;
                            return __assign(__assign({}, member.user), { scope: member.scope });
                        });
                        return [2 /*return*/, { userScope: user.scope, requestUser: requestUser }];
                }
            });
        });
    };
    ClubService.prototype.clubOnOff = function (openClubData, email, isOpened) {
        return __awaiter(this, void 0, void 0, function () {
            var clubData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Club.findOne({
                            where: { title: openClubData.q, type: openClubData.type },
                            relations: ['member', 'member.user']
                        })];
                    case 1:
                        clubData = _a.sent();
                        if (!email) {
                            throw new common_1.HttpException('이메일이 존재하지 않습니다.', common_1.HttpStatus.UNAUTHORIZED);
                        }
                        if (!clubData.member.find(function (member) {
                            return member.user.email === email && member.scope === 'HEAD';
                        }))
                            throw new common_1.HttpException('동아리 부장이 아닙니다', common_1.HttpStatus.FORBIDDEN);
                        return [4 /*yield*/, this.Club.update({ title: openClubData.q, type: openClubData.type }, { isOpened: isOpened })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClubService.prototype.kickUser = function (kickUserData, email) {
        return __awaiter(this, void 0, void 0, function () {
            var clubData, userData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Club.findOne({
                            where: { title: kickUserData.q, type: kickUserData.type },
                            relations: ['member', 'member.user']
                        })];
                    case 1:
                        clubData = _a.sent();
                        if (!email) {
                            throw new common_1.HttpException('이메일이 존재하지 않습니다.', common_1.HttpStatus.UNAUTHORIZED);
                        }
                        if (clubData.member.find(function (member) {
                            return (member.user.email === kickUserData.userId && member.scope === 'HEAD');
                        }))
                            throw new common_1.HttpException('부장은 자기 자신을 방출 할 수 없습니다', common_1.HttpStatus.FORBIDDEN);
                        return [4 /*yield*/, this.User.findOne({
                                where: { email: kickUserData.userId }
                            })];
                    case 2:
                        userData = _a.sent();
                        if (!clubData.member.find(function (member) {
                            return member.user.email === email && member.scope === 'HEAD';
                        }))
                            throw new common_1.HttpException('동아리 부장이 아닙니다', common_1.HttpStatus.FORBIDDEN);
                        return [4 /*yield*/, this.Member["delete"]({ club: clubData, user: userData })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClubService.prototype.delegation = function (userData, email) {
        return __awaiter(this, void 0, void 0, function () {
            var clubData, member, headMember;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Club.findOne({
                            where: {
                                title: userData.q,
                                type: userData.type
                            },
                            relations: ['member', 'member.user']
                        })];
                    case 1:
                        clubData = _a.sent();
                        if (!email) {
                            throw new common_1.HttpException('이메일이 존재하지 않습니다.', common_1.HttpStatus.UNAUTHORIZED);
                        }
                        if (!clubData.member.find(function (member) {
                            return member.user.email === email && member.scope === 'HEAD';
                        }))
                            throw new common_1.HttpException('동아리 부장이 아닙니다', common_1.HttpStatus.FORBIDDEN);
                        member = clubData.member.find(function (member) {
                            return member.user.email === userData.userId;
                        });
                        if (!member)
                            throw new common_1.HttpException('멤버가 없습니다', common_1.HttpStatus.NOT_FOUND);
                        return [4 /*yield*/, this.Member.update({ club: clubData, user: member.user }, { scope: 'HEAD' })];
                    case 2:
                        _a.sent();
                        headMember = clubData.member.find(function (member) {
                            return member.user.email === email;
                        });
                        return [4 /*yield*/, this.Member.update({ club: clubData, user: headMember.user }, { scope: 'MEMBER' })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClubService.prototype.editClub = function (editClubData, email) {
        return __awaiter(this, void 0, void 0, function () {
            var newActivityUrls, newMember, deleteActivityUrls, deleteMember, clubData, _i, newMember_1, email_1, userData, clubMemberData, checkMember, check, _a, deleteMember_1, email_2, userData, clubmember, checkMember, check, _b, newActivityUrls_1, image, clubImage, _c, deleteActivityUrls_1, image, clubImageData;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        newActivityUrls = editClubData.newActivityUrls, newMember = editClubData.newMember, deleteActivityUrls = editClubData.deleteActivityUrls, deleteMember = editClubData.deleteMember;
                        return [4 /*yield*/, this.Club.findOne({
                                where: {
                                    title: editClubData.q,
                                    type: editClubData.type
                                },
                                relations: ['member', 'member.user']
                            })];
                    case 1:
                        clubData = _d.sent();
                        if (!email) {
                            throw new common_1.HttpException('이메일이 존재하지 않습니다.', common_1.HttpStatus.UNAUTHORIZED);
                        }
                        if (!clubData) {
                            throw new common_1.HttpException('존재하지 않는 동아리입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        if (!clubData.member.find(function (member) {
                            return member.user.email === email && member.scope === 'HEAD';
                        })) {
                            throw new common_1.HttpException('동아리 부장이 아닙니다.', common_1.HttpStatus.FORBIDDEN);
                        }
                        if (!newMember) return [3 /*break*/, 9];
                        _i = 0, newMember_1 = newMember;
                        _d.label = 2;
                    case 2:
                        if (!(_i < newMember_1.length)) return [3 /*break*/, 9];
                        email_1 = newMember_1[_i];
                        return [4 /*yield*/, this.User.findOne({ where: { email: email_1 } })];
                    case 3:
                        userData = _d.sent();
                        return [4 /*yield*/, this.Member.findOne({
                                where: { user: userData, club: clubData }
                            })];
                    case 4:
                        clubMemberData = _d.sent();
                        return [4 /*yield*/, this.Member.find({
                                where: { user: userData },
                                relations: ['club']
                            })];
                    case 5:
                        checkMember = _d.sent();
                        check = checkMember.filter(function (member) {
                            return member.club.type === editClubData.type;
                        });
                        if (!!check) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.Member.save(this.Member.create({
                                user: userData,
                                club: clubData,
                                scope: 'MEMBER'
                            }))];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        if (!userData) {
                            throw new common_1.HttpException('존재하지 않는 유저입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        else if (clubMemberData) {
                            throw new common_1.HttpException('동아리에 이미 있는 유저입니다.', common_1.HttpStatus.CONFLICT);
                        }
                        _d.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9:
                        if (!deleteMember) return [3 /*break*/, 17];
                        _a = 0, deleteMember_1 = deleteMember;
                        _d.label = 10;
                    case 10:
                        if (!(_a < deleteMember_1.length)) return [3 /*break*/, 17];
                        email_2 = deleteMember_1[_a];
                        return [4 /*yield*/, this.User.findOne({ where: { email: email_2 } })];
                    case 11:
                        userData = _d.sent();
                        return [4 /*yield*/, this.Member.findOne({
                                where: { user: userData, club: clubData }
                            })];
                    case 12:
                        clubmember = _d.sent();
                        return [4 /*yield*/, this.Member.find({
                                where: { user: userData },
                                relations: ['club']
                            })];
                    case 13:
                        checkMember = _d.sent();
                        check = checkMember.filter(function (member) {
                            return member.club.type === editClubData.type;
                        });
                        if (!!check) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.Member["delete"]({ user: userData, club: clubData })];
                    case 14:
                        _d.sent();
                        _d.label = 15;
                    case 15:
                        if (!userData) {
                            throw new common_1.HttpException('존재하지 않는 유저입니다.', common_1.HttpStatus.NOT_FOUND);
                        }
                        else if (!clubmember) {
                            throw new common_1.HttpException('동아리에 존재하지 않는 유저입니다.', common_1.HttpStatus.CONFLICT);
                        }
                        _d.label = 16;
                    case 16:
                        _a++;
                        return [3 /*break*/, 10];
                    case 17:
                        if (!newActivityUrls) return [3 /*break*/, 29];
                        _b = 0, newActivityUrls_1 = newActivityUrls;
                        _d.label = 18;
                    case 18:
                        if (!(_b < newActivityUrls_1.length)) return [3 /*break*/, 22];
                        image = newActivityUrls_1[_b];
                        return [4 /*yield*/, this.Image.findOne({
                                where: { club: clubData.id, url: image }
                            })];
                    case 19:
                        clubImage = _d.sent();
                        if (clubImage) {
                            throw new common_1.HttpException('동아리에 존재하는 이미지입니다.', common_1.HttpStatus.CONFLICT);
                        }
                        return [4 /*yield*/, this.Image.save(this.Image.create({ url: image, club: clubData.id }))];
                    case 20:
                        _d.sent();
                        _d.label = 21;
                    case 21:
                        _b++;
                        return [3 /*break*/, 18];
                    case 22:
                        if (!deleteActivityUrls) return [3 /*break*/, 27];
                        _c = 0, deleteActivityUrls_1 = deleteActivityUrls;
                        _d.label = 23;
                    case 23:
                        if (!(_c < deleteActivityUrls_1.length)) return [3 /*break*/, 27];
                        image = deleteActivityUrls_1[_c];
                        return [4 /*yield*/, this.Image.findOne({
                                where: { club: clubData.id, url: image }
                            })];
                    case 24:
                        clubImageData = _d.sent();
                        if (!clubImageData) {
                            throw new common_1.HttpException('동아리에 존재하지 않는 이미지입니다.', common_1.HttpStatus.CONFLICT);
                        }
                        return [4 /*yield*/, this.Image["delete"]({ url: image, club: clubData.id })];
                    case 25:
                        _d.sent();
                        _d.label = 26;
                    case 26:
                        _c++;
                        return [3 /*break*/, 23];
                    case 27: return [4 /*yield*/, this.Club.update({ title: editClubData.q, type: editClubData.type }, {
                            title: editClubData.title,
                            description: editClubData.description,
                            bannerUrl: editClubData.bannerUrl,
                            contact: editClubData.contact,
                            teacher: editClubData.teacher,
                            notionLink: editClubData.notionLink
                        })];
                    case 28:
                        _d.sent();
                        _d.label = 29;
                    case 29: return [2 /*return*/];
                }
            });
        });
    };
    ClubService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(Club_entity_1.Club)),
        __param(1, typeorm_1.InjectRepository(Member_entity_1.Member)),
        __param(2, typeorm_1.InjectRepository(User_entity_1.User)),
        __param(3, typeorm_1.InjectRepository(image_entity_1.Image)),
        __param(4, typeorm_1.InjectRepository(RequestJoin_entity_1.RequestJoin))
    ], ClubService);
    return ClubService;
}());
exports.ClubService = ClubService;
