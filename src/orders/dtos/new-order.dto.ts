import { ApiProperty } from '@nestjs/swagger';
import { CustomerDto } from './customer.dto';
import { OrderItemsListDto } from './order-items-list.dto';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, Validate } from 'class-validator';

import { Ecommerce } from 'ckh-typings';
import { IsCurrency } from '../typeGuards/custom.validators';

export class NewOrderDto
  implements Pick<Ecommerce.OrderModel, 'orderNotes' | 'customer'>
{
  @ApiProperty({
    description: 'This is the value of the products in the cart',
    type: [OrderItemsListDto],
  })
  @IsArray()
  @Validate((value: any) => {
    if (!(value instanceof OrderItemsListDto)) {
      return { message: 'Order Items not correctly formatted' };
    }
    return true;
  })
  @Type(() => OrderItemsListDto)
  orderItems: OrderItemsListDto[];

  @ApiProperty({
    description:
      'This is the information about the customer - WARNING - Be AWARE of GDPR!',
    type: CustomerDto,
  })
  @Validate((value: any) => {
    if (!(value instanceof CustomerDto)) {
      return { message: 'Customer Information not correctly formatted' };
    }
    return true;
  })
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({
    description: 'This is the currency the order have been made in',
    example: 'DKK',
  })
  @IsString()
  @IsCurrency({ message: 'Currency is not correct type' })
  orderCurrency: Ecommerce.CurrencyType;

  @IsOptional()
  @ApiProperty({
    description: 'This is any notes associated with the order',
    example: 'Place at door!',
    required: false,
  })
  orderNotes: string;
}
