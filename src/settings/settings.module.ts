import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { systemNotification } from './entities/systemNotification.entity';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([systemNotification])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
