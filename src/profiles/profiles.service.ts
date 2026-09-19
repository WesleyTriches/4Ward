import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateProfileDto } from 'src/dtos/create-profile-dto';
import { UpdateProfileDto } from 'src/dtos/update-profile-dto';

@Injectable()
export class ProfilesService {

    constructor(
        private prisma: PrismaService
    ) { }

    async create(dto: CreateProfileDto) {
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user) {
            throw new BadRequestException('Usuário não existe.');
        }
        const existing = await this.prisma.profile.findUnique({
            where: {
                userId: dto.userId
            }
        });
        if (existing) {
            throw new ConflictException('Usuário já possui um perfil.');
        }
        await this.prisma.profile.create({
            data: {
                userId: dto.userId ?? 0,
                fullName: dto.fullName ?? '',
                birthDate: dto.birthDate ?? '',
                avatarUrl: dto.avatarUrl ?? ''
            }
        });
    }

    async update(id: number, dto: UpdateProfileDto) {
        const profile = await this.prisma.profile.findUnique({
            where: { id }
        });
        if (!profile) throw new NotFoundException('Perfil não encontrado.');
        await this.prisma.profile.update({
            where: { id }, data: {
                birthDate: dto.birthDate,
                fullName: dto.fullName,
                avatarUrl: dto.avatarUrl,
            }
        });
    }

    async findOne(id: number) {
        const p = await this.prisma.profile.findUnique({ where: { id } });
        if (!p) throw new NotFoundException('Perfil não encontrado.');
        return {
            id: p.id,
            userId: p.userId,
            fullName: p.fullName,
            birthDate: p.birthDate?.toISOString(),
            avatarUrl: p.avatarUrl ?? '',
        };
    }


}
