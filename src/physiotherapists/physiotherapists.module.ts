import { Module } from '@nestjs/common';
import { PhysiotherapistsController } from './physiotherapists.controller';
import { PhysiotherapistsService } from './physiotherapists.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [PhysiotherapistsController],
  providers: [
    PhysiotherapistsService,
    PrismaService,
  ],
})
export class PhysiotherapistsModule {}
