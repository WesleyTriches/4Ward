import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateAppointmentDto } from 'src/dtos/create-appointment-dto';
import { CancelAppointmentDto } from 'src/dtos/cancel-appointment-dto';
import { CompleteAppointmentDto } from 'src/dtos/complete-appointment-dto';
import { RescheduleAppointmentDto } from 'src/dtos/reschedule-appointment-dto';
import {
  AppointmentStatus,
  CancellationActor,
  UserRole,
} from 'src/generated/prisma/enums';

const appointmentInclude = {
  schedule: true,
  patient: true,
  physiotherapist: {
    include: {
      profile: true,
      specialty: true,
    },
  },
};

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateAppointmentDto) {
    const profile = await this.getProfile(userId);

    if (profile.user.role !== UserRole.PATIENT) {
      throw new ForbiddenException('Apenas pacientes podem agendar consultas.');
    }

    const schedule = await this.prisma.schedule.findUnique({
      where: { id: dto.scheduleId },
      include: { physiotherapist: true },
    });

    if (!schedule) {
      throw new NotFoundException('Horário não encontrado.');
    }

    if (schedule.dateTime <= new Date()) {
      throw new BadRequestException('Esse horário já passou.');
    }

    await this.ensurePatientIsFree(profile.id, schedule.dateTime);

    return this.prisma.$transaction(async (tx) => {
      //só ocupa o horário se ele ainda estiver livre e previne 2 pacientes no mesmo horário
      const { count } = await tx.schedule.updateMany({
        where: { id: schedule.id, available: true },
        data: { available: false },
      });

      if (count === 0) {
        throw new ConflictException('Horário indisponível.');
      }

      return tx.appointment.create({
        data: {
          patientId: profile.id,
          physiotherapistId: schedule.physiotherapistId,
          scheduleId: schedule.id,
          // preço congelado no momento do agendamento
          price: schedule.physiotherapist.sessionPrice,
          reason: dto.reason,
          painLevel: dto.painLevel,
        },
        include: appointmentInclude,
      });
    });
  }


  async findMine(userId: number, status?: AppointmentStatus) {
    const profile = await this.getProfile(userId);

    const where =
      profile.user.role === UserRole.PHYSIOTHERAPIST
        ? { physiotherapistId: this.requirePhysio(profile).id }
        : { patientId: profile.id };

    return this.prisma.appointment.findMany({
      where: { ...where, status },
      include: appointmentInclude,
      orderBy: { schedule: { dateTime: 'asc' } },
    });
  }

  async findOne(userId: number, id: number) {
    const profile = await this.getProfile(userId);
    const { appointment } = await this.getAccessibleAppointment(profile, id);
    return appointment;
  }

  async cancel(userId: number, id: number, dto: CancelAppointmentDto) {
    const profile = await this.getProfile(userId);
    const { appointment, actor } = await this.getAccessibleAppointment(
      profile,
      id,
    );

    this.ensureScheduled(appointment.status);

    if (appointment.schedule.dateTime <= new Date()) {
      throw new BadRequestException(
        'Não é possível cancelar uma consulta que já começou. Marque como realizada ou falta.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      //libera o horário para outro paciente
      await tx.schedule.update({
        where: { id: appointment.scheduleId },
        data: { available: true },
      });

      return tx.appointment.update({
        where: { id },
        data: {
          status: AppointmentStatus.CANCELLED,
          cancelledBy: actor,
          cancelReason: dto.cancelReason,
        },
        include: appointmentInclude,
      });
    });
  }

  async complete(userId: number, id: number, dto: CompleteAppointmentDto) {
    await this.ensureCanFinish(userId, id);

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.COMPLETED,
        sessionNotes: dto.sessionNotes,
      },
      include: appointmentInclude,
    });
  }

  async noShow(userId: number, id: number) {
    await this.ensureCanFinish(userId, id);

    return this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.NO_SHOW },
      include: appointmentInclude,
    });
  }

  async reschedule(userId: number, id: number, dto: RescheduleAppointmentDto) {
    const profile = await this.getProfile(userId);
    const { appointment, actor } = await this.getAccessibleAppointment(
      profile,
      id,
    );

    this.ensureScheduled(appointment.status);

    if (appointment.schedule.dateTime <= new Date()) {
      throw new BadRequestException(
        'Não é possível remarcar uma consulta que já começou.',
      );
    }

    const newSchedule = await this.prisma.schedule.findUnique({
      where: { id: dto.newScheduleId },
    });

    if (!newSchedule) {
      throw new NotFoundException('Novo horário não encontrado.');
    }

    if (newSchedule.physiotherapistId !== appointment.physiotherapistId) {
      throw new BadRequestException(
        'O novo horário precisa ser do mesmo fisioterapeuta.',
      );
    }

    if (newSchedule.dateTime <= new Date()) {
      throw new BadRequestException('O novo horário já passou.');
    }

    await this.ensurePatientIsFree(
      appointment.patientId,
      newSchedule.dateTime,
      appointment.id,
    );

    return this.prisma.$transaction(async (tx) => {
      //ocupa o novo horário (se ainda estiver livre)
      const { count } = await tx.schedule.updateMany({
        where: { id: newSchedule.id, available: true },
        data: { available: false },
      });

      if (count === 0) {
        throw new ConflictException('Novo horário indisponível.');
      }

      //libera o horário antigo
      await tx.schedule.update({
        where: { id: appointment.scheduleId },
        data: { available: true },
      });

      //consulta antiga fica como cancelada
      await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          status: AppointmentStatus.CANCELLED,
          cancelledBy: actor,
          cancelReason: dto.reason ?? 'Consulta remarcada.',
        },
      });

      // nova consulta aponta para a antiga
      return tx.appointment.create({
        data: {
          patientId: appointment.patientId,
          physiotherapistId: appointment.physiotherapistId,
          scheduleId: newSchedule.id,
          price: appointment.price,
          reason: appointment.reason,
          painLevel: appointment.painLevel,
          rescheduledFromId: appointment.id,
        },
        include: {
          ...appointmentInclude,
          rescheduledFrom: true,
        },
      });
    });
  }

  private async getProfile(userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { user: true, physiotherapist: true },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    return profile;
  }

  private requirePhysio(profile: Awaited<ReturnType<typeof this.getProfile>>) {
    if (!profile.physiotherapist) {
      throw new NotFoundException('Perfil de fisioterapeuta não encontrado.');
    }
    return profile.physiotherapist;
  }

  //busca a consulta e garante que o usuário é o paciente ou o fisio dela
  private async getAccessibleAppointment(
    profile: Awaited<ReturnType<typeof this.getProfile>>,
    id: number,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: appointmentInclude,
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada.');
    }

    const isPatient = appointment.patientId === profile.id;
    const isPhysio =
      appointment.physiotherapistId === profile.physiotherapist?.id;

    if (!isPatient && !isPhysio) {
      throw new ForbiddenException('Você não tem acesso a esta consulta.');
    }

    const actor = isPhysio
      ? CancellationActor.PHYSIOTHERAPIST
      : CancellationActor.PATIENT;

    return { appointment, actor };
  }

  //só o fisio da consulta, depois do horário, com status SCHEDULED
  private async ensureCanFinish(userId: number, id: number) {
    const profile = await this.getProfile(userId);
    const { appointment, actor } = await this.getAccessibleAppointment(
      profile,
      id,
    );

    if (actor !== CancellationActor.PHYSIOTHERAPIST) {
      throw new ForbiddenException(
        'Apenas o fisioterapeuta pode finalizar a consulta.',
      );
    }

    this.ensureScheduled(appointment.status);

    if (appointment.schedule.dateTime > new Date()) {
      throw new BadRequestException(
        'A consulta ainda não aconteceu.',
      );
    }
  }

  //estados finais não podem mais mudar
  private ensureScheduled(status: AppointmentStatus) {
    if (status !== AppointmentStatus.SCHEDULED) {
      throw new BadRequestException(
        `Consulta com status ${status} não pode ser alterada.`,
      );
    }
  }

  //paciente não pode ter duas consultas no mesmo horário
  private async ensurePatientIsFree(
    patientId: number,
    dateTime: Date,
    ignoreAppointmentId?: number,
  ) {
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        patientId,
        status: AppointmentStatus.SCHEDULED,
        schedule: { dateTime },
        NOT: ignoreAppointmentId ? { id: ignoreAppointmentId } : undefined,
      },
    });

    if (conflict) {
      throw new ConflictException(
        'Você já tem uma consulta marcada nesse horário.',
      );
    }
  }
}