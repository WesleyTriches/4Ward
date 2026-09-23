import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDTO } from 'src/dtos/create-users-dto';
import { GetUserDTO } from 'src/dtos/get-user-dto';
import { UserRole } from 'src/generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createUser(dto: CreateUserDTO) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role ?? UserRole.PATIENT,
      },
    });
  }

  async getAllUsers(): Promise<GetUserDTO[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async updateUser(
    id: number,
    dto: CreateUserDTO,
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

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}