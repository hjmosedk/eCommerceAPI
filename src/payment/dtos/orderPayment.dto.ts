import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, Validate, IsString } from 'class-validator';
import { Ecommerce } from 'ckh-typings';
import { OrderItemsListDto } from '../../orders/dtos/order-items-list.dto';
import { IsCurrency } from '../../orders/typeGuards/custom.validators';

export class OrderPaymentDTO {
  @ApiProperty({
    description: 'This is the currency and should be one of the acceptable ',
    example: 'DKK',
    enum: [Ecommerce.CurrencyType],
  })
  @IsCurrency({ message: 'Currency is not correct type' })
  orderCurrency: Ecommerce.CurrencyType;

  @ApiProperty({
    description:
      'This is the items in the cart. For security reasons the orderPrice is calculated on the backend',
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
}
