import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  ParseIntPipe,
} from '@nestjs/common';

import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from 'src/dtos/create-schedule-dto';

@Controller('schedules')
export class SchedulesController {
  constructor(
    private schedulesService: SchedulesService,
  ) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() dto: CreateScheduleDto,
  ) {
    return this.schedulesService.create(
      req.user.sub,
      dto,
    );
  }

  // Agenda do fisioterapeuta logado
  @Get('me')
  async findMine(
    @Req() req: any,
    @Query('date') date?: string,
  ) {
    return this.schedulesService.findMine(
      req.user.sub,
      date,
    );
  }

  // Horários disponíveis de um fisioterapeuta
  @Get()
  async findByPhysiotherapist(
    @Query('physiotherapistId', ParseIntPipe)
    physiotherapistId: number,

    @Query('date')
    date?: string,
  ) {
    return this.schedulesService.findByPhysiotherapist(
      physiotherapistId,
      date,
    );
  }
}