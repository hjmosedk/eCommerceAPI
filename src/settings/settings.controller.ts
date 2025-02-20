//istanbul ignore file
//* The functionality of this file is not yet implemented fully, so it will be tested at a later date.
import {
  Controller,
  Get,
  Param,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('Settings endpoints')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('seedData')
  @HttpCode(204)
  @ApiOperation({
    description:
      'An endpoint to seed data into the database, when setting up the system for the first time',
  })
  async seedData() {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    try {
      await this.settingsService.seedData();
    } catch (error) {
      throw new BadRequestException(
        `Somethings gone wrong in the seeding ${error.message}`,
      );
    }

    return;
  }

  @Get(':title')
  @ApiOperation({
    description: 'This will return the relevant notificationMessage',
  })
  async getSystemNotification(@Param('title') title: string) {
    const allNotifications = await this.settingsService.getAll();

    const validTitles = allNotifications.filter(
      (notification) => notification.title === title,
    );

    const systemNotification = await this.settingsService.getOne(title);

    if (!title || !validTitles || !systemNotification) {
      throw new BadRequestException('Title is not in database');
    }

    return systemNotification;
  }
}
