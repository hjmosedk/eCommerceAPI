import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyType } from '../entities/product.entity';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'This is the name of the new product',
    example: 'Gloves',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'This is the name description of the product',
    example: 'These gloves have been made with real leather',
  })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description:
      'This is the category of the product, it can be used on the frontend to sort the products',
    example: 'Clothes',
  })
  category: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'This is the name of the new product',
    example: 'Gloves',
  })
  price: number;

  @IsString()
  @IsOptional()
  @IsEnum(CurrencyType)
  @ApiProperty({
    required: false,
    description:
      'This is the currency of the price - This is important, and must never be empty, as it is required to calculate the price - any of the following values are valid: DKK, USD, EUR, and GBP - At this time, it is not support to change between currency',
    example: 'DKK',
  })
  currency: CurrencyType;

  @IsInt()
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    required: false,
    description: 'This is the number of items',
    example: '10',
  })
  quantity: number;
}
