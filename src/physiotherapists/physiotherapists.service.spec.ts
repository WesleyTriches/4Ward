import { Test, TestingModule } from '@nestjs/testing';
import { PhysiotherapistsService } from './physiotherapists.service';

describe('PhysiotherapistsService', () => {
  let service: PhysiotherapistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhysiotherapistsService],
    }).compile();

    service = module.get<PhysiotherapistsService>(PhysiotherapistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
