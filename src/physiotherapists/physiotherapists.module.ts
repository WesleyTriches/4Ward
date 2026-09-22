import { Module } from '@nestjs/common';
import { PhysiotherapistsService } from './physiotherapists.service';
import { PhysiotherapistsController } from './physiotherapists.controller';

@Module({
  providers: [PhysiotherapistsService],
  controllers: [PhysiotherapistsController]
})
export class PhysiotherapistsModule {}
