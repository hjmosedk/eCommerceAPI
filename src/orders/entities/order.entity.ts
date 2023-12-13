import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './orderItem.entity';
import { Customer } from './customer.entity';

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  RESERVED = 'RESERVED',
  CONFIRMED = 'CONFIRMED',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  CLOSED = 'CLOSED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'This is the main ID of the product',
    example: 1,
  })
  id: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  @JoinColumn()
  @ApiProperty({ description: 'This is the content of the order' })
  orderItems: OrderItem[];

  @Column({ type: 'date', update: false, default: () => 'CURRENT_TIMESTAMP' })
  @IsDefined()
  @ApiProperty({ description: 'This is the time of the creation of the order' })
  orderDate: Date;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  @IsDefined()
  @ApiProperty({
    description: 'This is the last time there where any change to the order',
  })
  lastChange: Date;

  @Column({ type: 'json' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the first name of the customer (to be updated with a User reference in the future)',
  })
  customer: Customer;

  @IsDefined()
  @ApiProperty({
    description:
      'This is a representation of the status of the order in the system',
  })
  orderStatus: string;

  @IsOptional()
  @ApiProperty({
    description: 'This is any information associated with the order',
  })
  orderNotes: string;

  constructor(partial: Partial<Order> = {}) {
    Object.assign(this, partial);
  }
}
