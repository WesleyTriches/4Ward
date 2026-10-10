import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import bcrypt from 'bcryptjs';

import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDTO } from 'src/dtos/create-users-dto';
import { UpdateUserDto } from 'src/dtos/update-users-dto';
import { UserRole } from 'src/generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async createUser(dto: CreateUserDTO) {
    const userExists =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (userExists) {
      throw new ConflictException(
        'Este email já está cadastrado.',
      );
    }

    const passwordHash = await bcrypt.hash(
      dto.password,
      10,
    );

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role ?? UserRole.PATIENT,
        profile: {
          create: {
            fullName: dto.name,
          },
        },
      },
    });
  }

  async updateUser(
    id: number,
    dto: UpdateUserDto,
  ): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        email: dto.email,
      },
    });
  }

  async deactivate(userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        active: false,
      },
    });

    return {
      message: 'Conta desativada com sucesso.',
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async reactivate(userId: number) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        active: true,
      },
    });
  }
}