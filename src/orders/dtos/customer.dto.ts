import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Customer } from '../entities/order.entity';
import { Type } from 'class-transformer';
import { CustomerInformationDto } from './customer-information.dto';
import { AddressDto } from './address-information.dto';

export class CustomerDto implements Customer {
  @IsDefined()
  @IsNotEmpty()
  @Validate((value: any) => {
    if (!(value instanceof CustomerInformationDto)) {
      return { message: 'Customer Information not correctly formatted' };
    }
    return true;
  })
  @Type(() => CustomerInformationDto)
  personalInformation: CustomerInformationDto;

  @Validate((value: any) => {
    if (!(value instanceof AddressDto)) {
      return { message: 'ShippingAddress not correctly defined' };
    }
    return true;
  })
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @IsOptional()
  @Validate((value: any) => {
    if (!(value instanceof AddressDto)) {
      return { message: 'ShippingAddress not correctly defined' };
    }
    return true;
  })
  @Type(() => AddressDto)
  billingAddress: AddressDto;

  @IsString()
  @IsOptional()
  notes: string;
}
