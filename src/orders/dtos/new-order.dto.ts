import { ApiProperty } from '@nestjs/swagger';
import { CustomerDto } from './customer.dto';
import { OrderItemsListDto } from './order-items-list.dto';
import { Type } from 'class-transformer';
import { IsArray, Validate } from 'class-validator';

export class NewOrderDto {
  @ApiProperty({
    description: 'This is the value of the products in the cart',
    type: [OrderItemsListDto],
    isArray: true,
  })
  @IsArray()
  @Validate((value: any) => {
    if (!(value instanceof OrderItemsListDto)) {
      return { message: 'Order Items not correctly formatted' };
    }
    return true;
  })
  @Type(() => OrderItemsListDto)
  items: OrderItemsListDto[];

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
}