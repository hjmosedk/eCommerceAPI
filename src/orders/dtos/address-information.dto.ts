import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Address } from '../entities/order.entity';

export class AddressDto implements Address {
  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  address2nd: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsNumber()
  @IsOptional()
  zipCode: number;
}
