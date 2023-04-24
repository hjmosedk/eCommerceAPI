import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum CurrencyType {
  DKK = 'DKK',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

@Entity()
export class Product {
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
    example: 'GLW1',
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
  currency: CurrencyType;

  @Column({ type: 'text', default: 'Not implemented yet' })
  @ApiProperty({
    description: 'This function is not yet implemented',
    example: 'Not yet',
  })
  picture: string;

  @Column({ type: 'int', default: 10 })
  @IsDefined()
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
