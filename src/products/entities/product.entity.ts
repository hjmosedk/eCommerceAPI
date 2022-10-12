import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @ApiProperty({
    description: 'This is the main ID of the product',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'This is the name of the product - The name is required',
    example: 'Gloves',
  })
  @Column()
  name: string;
  required: true;

  @ApiProperty({
    description: 'This is the SKU of the product, it is a text',
    example: 'GLW1',
  })
  @Column()
  sku: string;

  @ApiProperty({
    description: 'This is the description of the product',
    example: 'These gloves are made by real leather',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'This is the price of the product',
    example: 350,
  })
  @Column()
  price: number;

  @ApiProperty({
    description:
      'This is the currency used for this product - This will always defaults to DKK',
    example: 'DKK',
  })
  @Column({ length: 3, default: 'DKK' })
  currency: string;

  @ApiProperty({
    description: 'This function is not yet implemented',
    example: 'Not yet',
  })
  @Column()
  picture: string;

  @ApiProperty({
    description:
      'This is the quantity of the product in stock - it will default to 10',
    example: 10,
  })
  @Column({ default: 10 })
  quantity: number;
}

export class ProductRepositoryFake {
  public async find(): Promise<void> {
    [];
  }
}
