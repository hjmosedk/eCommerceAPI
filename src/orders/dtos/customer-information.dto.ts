import { CustomerInfo } from '../entities/order.entity';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CustomerInformationDto implements CustomerInfo {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  phone: string;
}
