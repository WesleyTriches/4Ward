import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';

import { PhysiotherapistsService } from './physiotherapists.service';
import { CreatePhysiotherapistDto } from 'src/dtos/create-physiotherapist-dto';

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
  async findAll() {
    return this.physiotherapistsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.physiotherapistsService.findOne(id);
  }
}
