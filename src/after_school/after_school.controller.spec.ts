import { Test, TestingModule } from '@nestjs/testing';
import { AfterSchoolController } from './after_school.controller';

describe('AfterSchoolController', () => {
  let controller: AfterSchoolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfterSchoolController],
    }).compile();

    controller = module.get<AfterSchoolController>(AfterSchoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
