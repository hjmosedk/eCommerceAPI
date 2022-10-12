import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @Length(1)
  @ApiProperty({
    description: 'This is the name of the new product',
    example: 'Gloves',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'This is the SKU of the product',
    example: 'GLW1',
  })
  sku: string;

  @IsString()
  @ApiProperty({
    description: 'This is the name description of the product',
    example: 'These gloves have been made with real leather',
  })
  description: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @ApiProperty({
    description: 'This is the name of the new product',
    example: 'Gloves',
  })
  price: number;

  @IsString()
  @Length(3, 3)
  currency: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}
