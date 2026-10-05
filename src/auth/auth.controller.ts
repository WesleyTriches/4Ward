import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/create-users-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private auth: AuthService,
    ) { }

    @Post('login')
    login(
        @Body() dto: {
            email: string;
            password: string;
        },
    ) {
        return this.auth.login(
            dto.email,
            dto.password,
        );
    }

    @Post('register')
    register(
        @Body() dto: CreateUserDTO,
    ) {
        return this.auth.register(dto);
    }

    @Post('reactivate')
    reactivate(
        @Body() dto: {
            email: string;
            password: string;
        },
    ) {
        return this.auth.reactivate(
            dto.email,
            dto.password,
        );
    }
}