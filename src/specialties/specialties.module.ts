import { Module } from '@nestjs/common';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './specialties.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [SpecialtiesController],
  providers: [SpecialtiesService, PrismaService],
})
export class SpecialtiesModule {}