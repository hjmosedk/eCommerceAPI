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

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', update: false })
  @IsDefined()
  @ApiProperty({ description: 'This is the ID of the product ordered' })
  productId: number;

  @Column({ type: 'int', update: false })
  @IsDefined()
  @ApiProperty({ description: 'This is the quantity ordered' })
  orderedQuantity: number;

  @Column({ type: 'int', update: false })
  @IsDefined()
  @ApiProperty({ description: 'This it the sales price of the product' })
  salesPrice: number;

  @ManyToOne(() => Order, (order) => order.id)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'productId' })
  product: Product;

  constructor(partial: Partial<Order> = {}) {
    Object.assign(this, partial);
  }
}
