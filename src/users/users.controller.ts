import {
    Body,
    Controller,
    Put,
    Req,
} from '@nestjs/common';

import { CreateUserDTO } from 'src/dtos/create-users-dto';
import { UpdateUserDto } from 'src/dtos/update-users-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private service: UsersService,
    ) { }

    @Put('me')
    async update(
        @Req() req: any,
        @Body() body: UpdateUserDto,
    ) {
        await this.service.updateUser(
            req.user.sub,
            body,
        );
    }

    @Put('me/deactivate')
    async deactivate(
        @Req() req: any,
    ) {
        return this.service.deactivate(
            req.user.sub,
        );
    }
}