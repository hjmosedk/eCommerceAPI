import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  IsEnum,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyType } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'This is the name of the new product',
    example: 'Gloves',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'This is the SKU of the product - Must be unique for each product, and cannot be changed after first creation',
    example: 'GLW-1',
  })
  sku: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'This is the name description of the product',
    example: 'These gloves have been made with real leather',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'This is the category of the product, it can be used on the frontend to sort the products',
    example: 'Clothes',
  })
  category: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    description: 'This is the price of the product',
    example: 25000,
  })
  price: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(CurrencyType)
  @ApiProperty({
    description:
      'This is the currency of the price - This is important, and must never be empty, as it is required to calculate the price - any of the following values are valid: DKK, USD, EUR, and GBP - At this time, it is not support to change between currency',
    example: 'DKK',
  })
  currency: CurrencyType;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'This is the number of items',
    example: '10',
  })
  quantity: number;

  @ApiProperty({
    description:
      'This is a reference to an image id, found on the server - It must be an uuid',
    example: '66de3cfd-3830-47d2-8ce3-bd622a6dbcf4',
  })
  @IsString()
  image: string;

  @ApiProperty({
    description:
      'This is the information about the percentage save on the product',
    example: 0,
  })
  @IsNumber()
  percentage: number;

  @ApiProperty({
    description:
      'This is the information about if the product is on sale or not',
    example: false,
  })
  @IsBoolean()
  onSale: boolean;

  @IsBoolean()
  @ApiProperty({
    description:
      'This property is used to define if the product is public or not public (shows up on the main page or only in the admin page)',
    example: true,
  })
  isPublic: boolean;
}
