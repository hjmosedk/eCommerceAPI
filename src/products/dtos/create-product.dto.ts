import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Length,
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
  @Length(3)
  @IsNotEmpty()
  @ApiProperty({
    description:
      'This is the SKU of the product - Must be unique for each product, and cannot be changed after first creation',
    example: 'GLW1',
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
    description: 'This is the name of the new product',
    example: 'Gloves',
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

  @ApiProperty({ description: 'This is the image file from the form' })
  @IsString()
  image: string;

  @ApiProperty({
    description:
      'This is the information about the percentage save on the product',
  })
  @IsNumber()
  percentage: number;

  @ApiProperty({
    description:
      'This is the information about if the product is on sale or not',
  })
  @IsBoolean()
  onSale: boolean;
}
