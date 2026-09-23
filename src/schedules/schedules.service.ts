import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateScheduleDto } from 'src/dtos/create-schedule-dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateScheduleDto) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId,
      },
      include: {
        physiotherapist: true,
      },
    });

    if (!profile?.physiotherapist) {
      throw new NotFoundException(
        'Perfil de fisioterapeuta não encontrado.',
      );
    }

    const dateTime = new Date(dto.dateTime);

    if (dateTime <= new Date()) {
      throw new ConflictException(
        'Não é possível cadastrar um horário no passado.',
      );
    }

    const existing = await this.prisma.schedule.findUnique({
      where: {
        physiotherapistId_dateTime: {
          physiotherapistId: profile.physiotherapist.id,
          dateTime,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Este horário já está cadastrado.',
      );
    }

    return this.prisma.schedule.create({
      data: {
        physiotherapistId: profile.physiotherapist.id,
        dateTime,
      },
    });
  }

  async findByPhysiotherapist(physiotherapistId: number) {
    return this.prisma.schedule.findMany({
      where: {
        physiotherapistId,
        available: true,
      },
      orderBy: {
        dateTime: 'asc',
      },
    });
  }
}