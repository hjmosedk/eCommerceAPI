import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'This is the main ID of the product',
    example: 1,
  })
  id: number;

  @Column()
  @ApiProperty({
    description: 'This is the name of the product - The name is required',
    example: 'Gloves',
  })
  name: string;
  required: true;

  @Column()
  @ApiProperty({
    description: 'This is the SKU of the product, it is a text',
    example: 'GLW1',
  })
  sku: string;

  @Column()
  @ApiProperty({
    description: 'This is the description of the product',
    example: 'These gloves are made by real leather',
  })
  description: string;

  @Column()
  @ApiProperty({
    description: 'This is the price of the product',
    example: 350,
  })
  price: number;

  @Column({ length: 3, default: 'DKK' })
  @ApiProperty({
    description:
      'This is the currency used for this product - This will always defaults to DKK',
    example: 'DKK',
  })
  currency: string;

  @Column({ default: 'Not implemented yet' })
  @ApiProperty({
    description: 'This function is not yet implemented',
    example: 'Not yet',
  })
  picture: string;

  @Column({ default: 10 })
  @ApiProperty({
    description:
      'This is the quantity of the product in stock - it will default to 10',
    example: 10,
  })
  quantity: number;
}

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
}
