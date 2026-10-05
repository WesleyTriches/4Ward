import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwt: JwtService,
        private userService: UsersService,
    ) { }

    async canActivate(
        ctx: ExecutionContext,
    ): Promise<boolean> {
        const req =
            ctx.switchToHttp().getRequest<any>();

        // libera preflight CORS
        const method = (
            req.method || ''
        ).toUpperCase();

        if (method === 'OPTIONS') {
            return true;
        }

        const url = String(
            req.originalUrl || req.url || '',
        );

        // rotas públicas
        if (
            url.includes('/auth/login') ||
            url.includes('/auth/register') ||
            url.includes('/auth/reactivate')
        ) {
            return true;
        }

        // exige Authorization: Bearer <token>
        const auth = String(
            req.headers?.authorization || '',
        );

        if (!auth.startsWith('Bearer ')) {
            throw new UnauthorizedException(
                'Bearer token ausente',
            );
        }

        const token = auth.slice(7).trim();

        try {
            // valida assinatura e expiração
            const payload =
                this.jwt.verify(token);

            // pega o usuário pelo id que veio do JWT
            const user =
                await this.userService.findById(
                    payload.sub,
                );

            if (!user) {
                throw new UnauthorizedException(
                    'Usuário não encontrado',
                );
            }

            if (!user.active) {
                throw new UnauthorizedException(
                    'Conta desativada',
                );
            }

            // disponibiliza os dados do JWT
            // para os controllers
            req.user = payload;

            return true;
        } catch (error) {
            if (
                error instanceof
                UnauthorizedException
            ) {
                throw error;
            }

            throw new UnauthorizedException(
                'Token inválido ou expirado',
            );
        }
    }
}