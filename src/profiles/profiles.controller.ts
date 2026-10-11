import {
  Body,
  Controller,
  Get,
  Put,
  Req,
} from '@nestjs/common';

import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from 'src/dtos/update-profile-dto';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private profilesService: ProfilesService,
  ) {}

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
