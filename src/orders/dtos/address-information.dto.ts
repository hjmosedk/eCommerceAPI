import { IsString, IsNumber, IsOptional } from 'class-validator';
import { AddressInformation } from '../entities/addressInformation.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto implements AddressInformation {
  @ApiProperty({
    description:
      'This is the address line for the customer, this could be either shipping or billing',
    type: 'string',
    example: 'Home Street 20',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description:
      'This is the 2nd address line for the customer, this could be either shipping or billing',
    type: 'string',
    example: 'Apartment Row 22',
    required: false,
  })
  @IsString()
  @IsOptional()
  address2nd: string;

  @ApiProperty({
    description:
      'This is the city of the customer - Could be either shipping or billing',
    type: 'string',
    example: 'Køge',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description:
      'This is the country of the customer - Could be either shipping or billing',
    type: 'string',
    example: 'Denmark',
  })
  @IsString()
  country: string;

  @ApiProperty({
    description:
      'This is the zipCode of the customer - Could be either shipping or billing',
    type: 'number',
    example: 9210,
  })
  @IsNumber()
  zipCode: string;
}
