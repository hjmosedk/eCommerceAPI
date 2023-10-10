import { CustomerDto } from './customer.dto';
import { OrderItemsListDto } from './order-items-list.dto';
import { Type } from 'class-transformer';
import { IsArray, Validate } from 'class-validator';

export class NewOrderDto {
  @IsArray()
  @Validate((value: any) => {
    if (!(value instanceof OrderItemsListDto)) {
      return { message: 'Order Items not correctly formatted' };
    }
    return true;
  })
  @Type(() => OrderItemsListDto)
  items: OrderItemsListDto[];

  @Validate((value: any) => {
    if (!(value instanceof CustomerDto)) {
      return { message: 'Customer Information not correctly formatted' };
    }
    return true;
  })
  @Type(() => CustomerDto)
  customer: CustomerDto;
}
