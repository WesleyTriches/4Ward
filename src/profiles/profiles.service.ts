import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateProfileDto } from 'src/dtos/create-profile-dto';
import { UpdateProfileDto } from 'src/dtos/update-profile-dto';

@Injectable()
export class ProfilesService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async create(
    userId: number,
    dto: CreateProfileDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Usuário não existe.',
      );
    }

    const existing =
      await this.prisma.profile.findUnique({
        where: {
          userId,
        },
      });

    if (existing) {
      throw new ConflictException(
        'Usuário já possui um perfil.',
      );
    }

    return this.prisma.profile.create({
      data: {
        userId,
        fullName: dto.fullName,
        birthDate: dto.birthDate || undefined,
        avatarUrl: dto.avatarUrl || undefined,
      },
    });
  }

  async findMe(userId: number) {
    const profile =
      await this.prisma.profile.findUnique({
        where: {
          userId,
        },
      });

    if (!profile) {
      throw new NotFoundException(
        'Perfil não encontrado.',
      );
    }

    return profile;
  }

  async updateMe(
    userId: number,
    dto: UpdateProfileDto,
  ) {
    const profile =
      await this.prisma.profile.findUnique({
        where: {
          userId,
        },
      });

    if (!profile) {
      throw new NotFoundException(
        'Perfil não encontrado.',
      );
    }

    return this.prisma.profile.update({
      where: {
        userId,
      },
      data: {
        fullName: dto.fullName,
        birthDate: dto.birthDate,
        avatarUrl: dto.avatarUrl,
      },
    });
  }
}