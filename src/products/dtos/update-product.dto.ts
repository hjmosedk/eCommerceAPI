import { Ecommerce } from 'ckh-typings';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto
  implements Omit<Ecommerce.ProductModel, 'id' | 'sku'>
{
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
    description: 'This is the price on the new products',
    example: 25000,
  })
  price: number;

  @IsString()
  @IsOptional()
  @IsEnum(Ecommerce.CurrencyType)
  @ApiProperty({
    required: false,
    description:
      'This is the currency of the price - This is important, and must never be empty, as it is required to calculate the price - any of the following values are valid: DKK, USD, EUR, and GBP - At this time, it is not support to change between currency',
    example: 'DKK',
  })
  currency: Ecommerce.CurrencyType;

  @IsInt()
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    required: false,
    description: 'This is the number of items',
    example: 10,
  })
  quantity: number;

  @ApiProperty({
    description: 'This is the image file from the form',
    example: '66de3cfd-3830-47d2-8ce3-bd622a6dbcf4',
  })
  @IsString()
  @IsOptional()
  image: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description:
      'This is the information about the percentage save on the product',
    example: 33,
  })
  percentage: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description:
      'This is the information about if the product is on sale or not',
    example: false,
  })
  onSale: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description:
      'This property is used to define if the product is public or not public (shows up on the main page or only in the admin page)',
    example: true,
  })
  isPublic: boolean;

  /* istanbul ignore next */ //* This does not need to be tested separately as this is standard practices, and is tested in other test
  constructor(partial: Partial<UpdateProductDto>) {
    /* istanbul ignore next */ //* This does not need to be tested separately as this is standard practices, and is tested in other test
    Object.assign(this, partial);
  }
}
