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
    constructor(private schedulesService: SchedulesService) { }

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

    @Get()
    async findByPhysiotherapist(
        @Query('physiotherapistId', ParseIntPipe)
        physiotherapistId: number,
    ) {
        return this.schedulesService.findByPhysiotherapist(
            physiotherapistId,
        );
    }
}