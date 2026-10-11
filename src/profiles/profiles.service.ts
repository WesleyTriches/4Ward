import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { UpdateProfileDto } from 'src/dtos/update-profile-dto';

@Injectable()
export class ProfilesService {
  constructor(
    private prisma: PrismaService,
  ) {}

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
