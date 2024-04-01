import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { ecommerce } from 'ckh-typings';

@Entity('orderItem')
export class OrderItem implements ecommerce.OrderItemModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', update: false })
  @IsDefined()
  @ApiProperty({ description: 'This is the ID of the product ordered' })
  productId: number;

  @Column({ type: 'int', update: false })
  @IsDefined()
  @ApiProperty({ description: 'This is the quantity ordered' })
  salesQuantity: number;

  @Column({ type: 'int', update: false })
  @IsDefined()
  @ApiProperty({ description: 'This it the sales price of the product' })
  price: number;

  @ManyToOne(() => Order, (order) => order.id)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'productId' })
  product: Product;

  constructor(partial: Partial<Order> = {}) {
    Object.assign(this, partial);
  }
}
