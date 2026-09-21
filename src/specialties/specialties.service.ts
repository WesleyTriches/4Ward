import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSpecialtyDto } from 'src/dtos/create-specialty-dto';

@Injectable()
export class SpecialtiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSpecialtyDto) {
    return this.prisma.specialty.create({
      data: {
        name: dto.name,
        description: dto.description,
        icon: dto.icon,
      },
    });
  }

  async findAll() {
    return this.prisma.specialty.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const specialty = await this.prisma.specialty.findUnique({
      where: { id },
    });

    if (!specialty) {
      throw new NotFoundException('Especialidade não encontrada');
    }

    return specialty;
  }

  async update(id: number, dto: CreateSpecialtyDto) {
    await this.findOne(id);

    return this.prisma.specialty.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        icon: dto.icon,
      },
    });
  }

  async delete(id: number) {
    await this.findOne(id);

    return this.prisma.specialty.delete({
      where: { id },
    });
  }
}