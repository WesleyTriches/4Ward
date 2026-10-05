import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';

import { SpecialtiesService } from './specialties.service';
import { CreateSpecialtyDto } from 'src/dtos/create-specialty-dto';
import { UpdateSpecialtyDto } from 'src/dtos/update-specialty-dto';
import { UserRole } from 'src/generated/prisma/enums';

@Controller('specialties')
export class SpecialtiesController {
  constructor(
    private specialtiesService: SpecialtiesService,
  ) { }

  @Post()
  async create(
    @Req() req: any,
    @Body() dto: CreateSpecialtyDto,
  ) {
    if (req.user.role !== UserRole.PHYSIOTHERAPIST) {
      throw new ForbiddenException(
        'Apenas fisioterapeutas podem criar especialidades.',
      );
    }

    return this.specialtiesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.specialtiesService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.specialtiesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSpecialtyDto,
  ) {
    if (req.user.role !== UserRole.PHYSIOTHERAPIST) {
      throw new ForbiddenException(
        'Apenas fisioterapeutas podem atualizar especialidades.',
      );
    }

    return this.specialtiesService.update(id, dto);
  }

}