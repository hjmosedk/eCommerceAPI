import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsPositive } from 'class-validator';
import { Ecommerce } from 'ckh-typings';
import { IsCurrency } from 'src/orders/typeGuards/custom.validators';

export class OrderPriceDTO {
  @ApiProperty({
    description:
      'This is the price, it must be a number, and in commutable with Dinerojs. 25000 is equal 250,00',
    example: 25000,
  })
  @IsNumber()
  @IsPositive()
  orderPrice: number;

  @ApiProperty({
    description: 'This is the currency and should be one of the acceptable ',
    example: 'DKK',
    enum: [Ecommerce.CurrencyType],
  })
  @IsCurrency({ message: 'Currency is not correct type' })
  orderCurrency: Ecommerce.CurrencyType;
}
