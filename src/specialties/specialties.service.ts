import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateSpecialtyDto } from 'src/dtos/create-specialty-dto';
import { UpdateSpecialtyDto } from 'src/dtos/update-specialty-dto';

@Injectable()
export class SpecialtiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSpecialtyDto) {
    const specialtyExists = await this.prisma.specialty.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (specialtyExists) {
      throw new ConflictException(
        'Especialidade já cadastrada',
      );
    }

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
      where: {
        id,
      },
    });

    if (!specialty) {
      throw new NotFoundException(
        'Especialidade não encontrada',
      );
    }

    return specialty;
  }

  async update(id: number, dto: UpdateSpecialtyDto) {
    await this.findOne(id);

    if (dto.name) {
      const specialtyExists =
        await this.prisma.specialty.findFirst({
          where: {
            name: dto.name,
            NOT: {
              id,
            },
          },
        });

      if (specialtyExists) {
        throw new ConflictException(
          'Já existe outra especialidade com esse nome',
        );
      }
    }

    return this.prisma.specialty.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        description: dto.description,
        icon: dto.icon,
      },
    });
  }

  async delete(id: number) {
    await this.findOne(id);

    const physiotherapistsCount =
      await this.prisma.physiotherapist.count({
        where: {
          specialtyId: id,
        },
      });

    if (physiotherapistsCount > 0) {
      throw new BadRequestException(
        'Não é possível excluir uma especialidade vinculada a fisioterapeutas',
      );
    }

    return this.prisma.specialty.delete({
      where: {
        id,
      },
    });
  }
}