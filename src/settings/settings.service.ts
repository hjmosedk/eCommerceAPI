import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { systemNotification } from './entities/systemNotification.entity';

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
}
