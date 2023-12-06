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
import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto implements Customer {
  @ApiProperty({
    description:
      'This is the information about the customer - !WARNING - Be aware of GDPR',
    type: CustomerInformationDto,
  })
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

  @ApiProperty({
    description:
      'This is the information about the invoice address - !WARNING - Be aware of GDPR',
    type: AddressDto,
  })
  @Validate((value: any) => {
    if (!(value instanceof AddressDto)) {
      return { message: 'InvoiceAddress not correctly defined' };
    }
    return true;
  })
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @ApiProperty({
    description:
      'This is the information about the shipping address - !WARNING - Be aware of GDPR',
    type: AddressDto,
  })
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
