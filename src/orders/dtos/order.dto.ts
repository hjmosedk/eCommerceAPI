import { ApiProperty } from '@nestjs/swagger';
import { CustomerDto } from './customer.dto';
import { OrderItemsListDto } from './order-items-list.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

import { Ecommerce } from 'ckh-typings';
import { IsCurrency } from '../typeGuards/custom.validators';

export class OrderDTO
  implements Omit<Ecommerce.OrderModel, 'paymentStatus' | 'paymentId'>
{
  @ApiProperty({ description: 'This is the Id of the order returned' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'This is the order date' })
  @IsDate()
  orderDate: Date;

  @ApiProperty({
    description: 'This is the last time the order was updated in the system',
  })
  @IsDate()
  lastChange: Date;

  @ApiProperty({ description: 'This is the current status of the order' })
  @IsEnum(Ecommerce.OrderStatus)
  orderStatus: Ecommerce.OrderStatus;

  @ApiProperty()
  @IsArray()
  @Type(() => OrderItemsListDto)
  orderItems: Ecommerce.OrderItemModel[];

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

  @ApiProperty({ description: 'This is the total price of the order' })
  @IsNumber()
  orderTotalPrice: number;

  @IsOptional()
  @ApiProperty({
    description: 'This is any notes associated with the order',
    example: 'Place at door!',
    required: false,
  })
  orderNotes: string;
}
