import { Entity, Column } from 'typeorm';
import { IsDefined, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PersonalInformation } from './personalInformation.entity';
import { AddressInformation } from './addressInformation.entity';

@Entity()
export class Customer {
  @Column({ type: 'json' })
  @IsDefined()
  @ApiProperty({
    description: 'This is the personal information of the customer',
  })
  personalInformation: PersonalInformation;

  @Column({ type: 'json' })
  @IsOptional()
  @ApiProperty({
    description:
      'This is the address where the customer wants to ship the products, if no shipping address is provide the billing address is used.',
    required: false,
  })
  shippingAddress: AddressInformation;

  @Column({ type: 'json' })
  @IsDefined()
  @ApiProperty({
    description: 'This is the address where the customer will be billed at',
  })
  billingAddress: AddressInformation;

  constructor(partial: Partial<Customer> = {}) {
    Object.assign(this, partial);
  }
}
