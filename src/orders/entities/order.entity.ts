import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './orderItem.entity';
import { Customer } from './customer.entity';

import { Ecommerce } from 'ckh-typings';

@Entity('order')
export class Order implements Ecommerce.OrderModel {
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

  @BeforeUpdate()
  updateLastChange() {
    this.lastChange = new Date();
  }

  @Column({ type: 'json' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the first name of the customer (to be updated with a User reference in the future)',
  })
  customer: Customer;

  @Column({ type: String, default: Ecommerce.OrderStatus.RECEIVED })
  @IsDefined()
  @ApiProperty({
    description:
      'This is a representation of the status of the order in the system',
  })
  orderStatus: Ecommerce.OrderStatus;

  @Column({ type: String, default: null })
  @IsOptional()
  @ApiProperty({
    description: 'This is any information associated with the order',
  })
  orderNotes: string;

  @Column({ type: String, default: null })
  @IsDefined()
  @ApiProperty({
    description:
      'This is the total price of the order - This is calculated by the api, it cannot be inputted',
    example: 25000,
  })
  orderTotalPrice: number;

  @Column({
    type: 'enum',
    enum: ['DKK', 'USD', 'EUR', 'GBP'],
    default: 'DKK',
  })
  @IsDefined()
  @ApiProperty({
    description:
      'This is the currency used for this product - This will always defaults to DKK',
    example: 'DKK',
  })
  orderCurrency: Ecommerce.CurrencyType;

  constructor(partial: Partial<Order> = {}) {
    Object.assign(this, partial);
  }
}
