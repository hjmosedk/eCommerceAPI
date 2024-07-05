import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('Settings endpoints')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

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
