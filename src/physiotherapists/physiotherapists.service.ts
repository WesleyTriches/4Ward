import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreatePhysiotherapistDto } from 'src/dtos/create-physiotherapist-dto';

@Injectable()
export class PhysiotherapistsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, dto: CreatePhysiotherapistDto) {
        const profile = await this.prisma.profile.findUnique({
            where: {
                userId: userId,
            },
            include: {
                user: true,
                physiotherapist: true,
            },
        });

        if (!profile) {
            throw new NotFoundException('Perfil não encontrado.');
        }

        if (profile.user.role !== 'PHYSIOTHERAPIST') {
            throw new ForbiddenException(
                'Apenas fisioterapeutas podem criar um perfil profissional.',
            );
        }

        if (profile.physiotherapist) {
            throw new ConflictException(
                'Este usuário já possui um perfil de fisioterapeuta.',
            );
        }

        const specialty = await this.prisma.specialty.findUnique({
            where: {
                id: dto.specialtyId,
            },
        });

        if (!specialty) {
            throw new NotFoundException('Especialidade não encontrada.');
        }

        const crefitoExists = await this.prisma.physiotherapist.findUnique({
            where: {
                crefito: dto.crefito,
            },
        });

        if (crefitoExists) {
            throw new ConflictException('CREFITO já cadastrado.');
        }

        return this.prisma.physiotherapist.create({
            data: {
                profileId: profile.id,
                specialtyId: dto.specialtyId,
                crefito: dto.crefito,
                bio: dto.bio,
                sessionPrice: dto.sessionPrice,
                city: dto.city,
                serviceMode: dto.serviceMode,
                experienceYears: dto.experienceYears,
            },
            include: {
                specialty: true,
                profile: true,
            },
        });
    }

    async findAll() {
        return this.prisma.physiotherapist.findMany({
            include: {
                specialty: true,
                profile: true,
            },
        });
    }

    async findOne(id: number) {
        const physiotherapist =
            await this.prisma.physiotherapist.findUnique({
                where: { id },
                include: {
                    specialty: true,
                    profile: true,
                },
            });

        if (!physiotherapist) {
            throw new NotFoundException('Fisioterapeuta não encontrado.');
        }

        return physiotherapist;
    }
}
