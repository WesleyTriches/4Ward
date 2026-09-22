import { Test, TestingModule } from '@nestjs/testing';
import { PhysiotherapistsController } from './physiotherapists.controller';

describe('PhysiotherapistsController', () => {
  let controller: PhysiotherapistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhysiotherapistsController],
    }).compile();

    controller = module.get<PhysiotherapistsController>(PhysiotherapistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
