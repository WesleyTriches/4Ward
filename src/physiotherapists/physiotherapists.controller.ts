import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { PhysiotherapistsService } from './physiotherapists.service';
import { CreatePhysiotherapistDto } from 'src/dtos/create-physiotherapist-dto';
import { ServiceMode } from 'src/generated/prisma/enums';

@Controller('physiotherapists')
export class PhysiotherapistsController {
  constructor(
    private physiotherapistsService: PhysiotherapistsService,
  ) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() dto: CreatePhysiotherapistDto,
  ) {
    return this.physiotherapistsService.create(
      req.user.sub,
      dto,
    );
  }

  @Get()
  async findAll(
    @Query('city')
    city?: string,

    @Query(
      'specialtyId',
      new ParseIntPipe({
        optional: true,
      }),
    )
    specialtyId?: number,

    @Query(
      'serviceMode',
      new ParseEnumPipe(ServiceMode, {
        optional: true,
      }),
    )
    serviceMode?: ServiceMode,
  ) {
    return this.physiotherapistsService.findAll({
      city,
      specialtyId,
      serviceMode,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.physiotherapistsService.findOne(id);
  }
}