import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateScheduleDto } from 'src/dtos/create-schedule-dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) { }

  async create(
    userId: number,
    dto: CreateScheduleDto,
  ) {
    const profile =
      await this.prisma.profile.findUnique({
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

    const existing =
      await this.prisma.schedule.findUnique({
        where: {
          physiotherapistId_dateTime: {
            physiotherapistId:
              profile.physiotherapist.id,
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
        physiotherapistId:
          profile.physiotherapist.id,
        dateTime,
      },
    });
  }

  // Horários disponíveis para o paciente
  async findByPhysiotherapist(
    physiotherapistId: number,
    date?: string,
  ) {
    const dateFilter =
      this.buildDateFilter(date);

    return this.prisma.schedule.findMany({
      where: {
        physiotherapistId,
        available: true,
        ...dateFilter,
      },

      orderBy: {
        dateTime: 'asc',
      },
    });
  }

  // Agenda do fisioterapeuta logado
  async findMine(
    userId: number,
    date?: string,
  ) {
    const profile =
      await this.prisma.profile.findUnique({
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

    const dateFilter =
      this.buildDateFilter(date);

    return this.prisma.schedule.findMany({
      where: {
        physiotherapistId:
          profile.physiotherapist.id,

        ...dateFilter,
      },

      include: {
        appointment: {
          include: {
            patient: true,
          },
        },
      },

      orderBy: {
        dateTime: 'asc',
      },
    });
  }

  private buildDateFilter(date?: string) {
    if (!date) {
      return {};
    }

    const start = new Date(
      `${date}T00:00:00`,
    );

    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException(
        'Data inválida.',
      );
    }

    const end = new Date(start);

    end.setDate(
      end.getDate() + 1,
    );

    return {
      dateTime: {
        gte: start,
        lt: end,
      },
    };
  }
}