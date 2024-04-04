import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Ecommerce } from 'ckh-typings';

export class OrderItemsListDto
  implements Omit<Ecommerce.OrderItemModel, 'productId' | 'product'>
{
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'This is the quantity of the item in the order',
    example: 6,
  })
  salesQuantity: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'This is the product id of the product to be ordered',
    example: 25,
  })
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'This is the price at time of sale',
    example: 25000,
  })
  price: number;
}
