import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Req,
} from '@nestjs/common';

import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from 'src/dtos/create-profile-dto';
import { UpdateProfileDto } from 'src/dtos/update-profile-dto';

@Controller('profiles')
export class ProfilesController {
    constructor(
        private profilesService: ProfilesService,
    ) { }

    @Post()
    async create(
        @Req() req: any,
        @Body() dto: CreateProfileDto,
    ) {
        return this.profilesService.create(
            req.user.sub,
            dto,
        );
    }

    @Get('me')
    async findMe(
        @Req() req: any,
    ) {
        return this.profilesService.findMe(
            req.user.sub,
        );
    }

    @Put('me')
    async updateMe(
        @Req() req: any,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.profilesService.updateMe(
            req.user.sub,
            dto,
        );
    }
}