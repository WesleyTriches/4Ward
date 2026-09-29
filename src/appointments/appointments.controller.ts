import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from 'src/dtos/create-appointment-dto';
import { CancelAppointmentDto } from 'src/dtos/cancel-appointment-dto';
import { CompleteAppointmentDto } from 'src/dtos/complete-appointment-dto';
import { RescheduleAppointmentDto } from 'src/dtos/reschedule-appointment-dto';
import { AppointmentStatus } from 'src/generated/prisma/enums';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.sub, dto);
  }

  @Get('me')
  async findMine(
    @Req() req: any,
    @Query('status', new ParseEnumPipe(AppointmentStatus, { optional: true }))
    status?: AppointmentStatus,
  ) {
    return this.appointmentsService.findMine(req.user.sub, status);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(req.user.sub, id);
  }

  @Patch(':id/cancel')
  async cancel(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelAppointmentDto,
  ) {
    return this.appointmentsService.cancel(req.user.sub, id, dto);
  }

  @Patch(':id/complete')
  async complete(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CompleteAppointmentDto,
  ) {
    return this.appointmentsService.complete(req.user.sub, id, dto);
  }

  @Patch(':id/no-show')
  async noShow(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.noShow(req.user.sub, id);
  }

  @Post(':id/reschedule')
  async reschedule(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RescheduleAppointmentDto,
  ) {
    return this.appointmentsService.reschedule(req.user.sub, id, dto);
  }
}