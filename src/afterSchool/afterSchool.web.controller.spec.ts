import { Test, TestingModule } from '@nestjs/testing';
import { AfterSchoolWebController } from './afterSchool.web.controller';

describe('AfterSchool.WebController', () => {
  let controller: AfterSchoolWebController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfterSchoolWebController],
    }).compile();

    controller = module.get<AfterSchoolWebController>(AfterSchoolWebController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
