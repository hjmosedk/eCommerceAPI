import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('systemNotifications')
export class systemNotification {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'This is the main system Notification or message',
    example: 1,
  })
  id: number;

  @Column({ type: 'text', update: false, unique: true })
  @IsDefined()
  @ApiProperty({
    description: 'This is the title of the notification',
    example: 'ConfirmOrderMessage',
  })
  title: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description: 'This is the content of the notification',
    example: 'This will advance the order to confirmed',
  })
  content: string;
}

/* istanbul ignore next*/
// * To be ignored, as it is used for testing only, no effect in production
export class ProductRepositoryFake {
  public async find(): Promise<void> {
    [];
  }
  public async findOne(): Promise<void> {
    [];
  }
  public async create(): Promise<void> {
    [];
  }
  public async save(): Promise<void> {
    [];
  }
  public async insert(): Promise<void> {
    [];
  }
}
