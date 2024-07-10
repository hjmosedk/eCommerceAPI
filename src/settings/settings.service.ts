import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { systemNotification } from './entities/systemNotification.entity';
import { systemNotificationMessage } from './basedata';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(systemNotification)
    private repo: Repository<systemNotification>,
  ) {}

  async getAll() {
    const allNotifications = await this.repo.find();
    if (!allNotifications) {
      return null;
    }

    return allNotifications;
  }

  async getOne(title: string) {
    if (!title) {
      return null;
    }
    return await this.repo.findOne({ where: { title } });
  }

  async seedData() {
    try {
      this.repo.delete({});
      for (const message of systemNotificationMessage) {
        const dbMessage = this.repo.create(message);
        await this.repo.save(dbMessage);
      }
    } catch (error) {
      throw new Error(`Error in seeding data: ${error.message}`);
    }
  }
}
