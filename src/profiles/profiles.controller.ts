import {
    Controller,
    Post,
    Get,
    Put,
    Param,
    Body,
    ParseIntPipe,
} from '@nestjs/common';
import { CreateProfileDto } from 'src/dtos/create-profile-dto';
import { UpdateProfileDto } from 'src/dtos/update-profile-dto';
import { ProfilesService } from './profiles.service';
@Controller('profiles')
export class ProfilesController {
    constructor(private profilesService: ProfilesService) { }
    @Post()
    async create(@Body() dto: CreateProfileDto) {
        return await this.profilesService.create(dto);
    }
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.profilesService.findOne(id);
    }
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.profilesService.update(id, dto);
    }
}