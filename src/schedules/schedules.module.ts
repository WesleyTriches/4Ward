import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [SchedulesController],
  providers: [
    SchedulesService,
    PrismaService,
  ],
})
export class SchedulesModule {}