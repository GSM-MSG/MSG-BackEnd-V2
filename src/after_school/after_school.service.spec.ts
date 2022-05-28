import { Test, TestingModule } from '@nestjs/testing';
import { AfterSchoolService } from './after_school.service';

describe('AfterSchoolService', () => {
  let service: AfterSchoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AfterSchoolService],
    }).compile();

    service = module.get<AfterSchoolService>(AfterSchoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
