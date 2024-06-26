import { Ecommerce } from 'ckh-typings';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { OrderItem } from '../../orders/entities/orderItem.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('product')
export class Product implements Ecommerce.ProductModel {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'This is the main ID of the product',
    example: 1,
  })
  id: number;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description: 'This is the name of the product - The name is required',
    example: 'Gloves',
  })
  name: string;

  @Column({ type: 'text', update: false, unique: true })
  @IsDefined()
  @ApiProperty({
    description:
      'This is the SKU of the product, it is a text - The name is required',
    example: 'GLW-1',
  })
  sku: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description: 'This is the description of the product',
    example: 'These gloves are made by real leather',
  })
  description: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description: 'This is the category of the product',
    example: 'clothes',
  })
  category: string;

  @Column({ type: 'int' })
  @IsDefined()
  @ApiProperty({
    description: 'This is the price of the product',
    example: 350,
  })
  price: number;

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
  currency: Ecommerce.CurrencyType;

  @Column({ type: 'text' })
  @ApiProperty({
    description:
      'This is where the ID of the image attached to this product is stored - The ID is generated by the service',
    example:
      'any UUIDv4 value (must be UUIDv4, as anything else will throw an error)',
  })
  image: string;

  @Column({ type: 'int', default: 10 })
  @IsDefined()
  @ApiProperty({
    description:
      'This is the quantity of the product in stock - it will default to 10',
    example: 10,
  })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({
    description:
      'This is a number to determine the percentage saving on the product - It is an number',
    example: 25,
  })
  percentage: number;

  @Column({ type: 'boolean', default: false })
  @IsDefined()
  @ApiProperty({
    description:
      'If this value is true, the product is on sale, if it is false, the product is not on sale',
  })
  onSale: boolean;

  @Column({ type: 'boolean', default: true })
  @IsDefined()
  @ApiProperty({
    description:
      'This property is used to define if the product is public or not public (shows up on the main page or only in the admin page)',
  })
  isPublic: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productId)
  @JoinColumn()
  orderItems: OrderItem[];
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
