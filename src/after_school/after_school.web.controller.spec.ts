import { Test, TestingModule } from '@nestjs/testing';
import { AfterSchool.WebController } from './after_school.web.controller';

describe('AfterSchool.WebController', () => {
  let controller: AfterSchool.WebController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfterSchool.WebController],
    }).compile();

    controller = module.get<AfterSchool.WebController>(AfterSchool.WebController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
