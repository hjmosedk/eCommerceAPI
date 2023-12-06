import { ApiProperty } from '@nestjs/swagger';
import { CustomerInfo } from '../entities/order.entity';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CustomerInformationDto implements CustomerInfo {
  @ApiProperty({
    description: 'This is the first name of the customer',
    type: 'string',
    example: 'Lars',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  firstName: string;

  @ApiProperty({
    description: 'This is the middle name of the customer',
    type: 'string',
    example: 'Olsen',
    required: false,
  })
  @IsString()
  @IsOptional()
  middleName: string;

  @ApiProperty({
    description: 'This is the last name of the customer',
    type: 'string',
    example: 'Larsen',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  lastName: string;

  @ApiProperty({
    description: 'This is the email contact of the customer',
    type: 'string',
    example: 'name@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @ApiProperty({
    description: 'This is the phone contact of the customer',
    type: 'string',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  phone: string;
}
