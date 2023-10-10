import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './orderItem.entity';

export enum OrderStatus {
  received = 'RECEIVED',
  reserved = 'RESERVED',
  confirmed = 'CONFIRMED',
  packed = 'PACKED',
  shipped = 'SHIPPED',
  closed = 'CLOSED',
}

export interface Customer {
  personalInformation: CustomerInfo;
  notes: string;
  shippingAddress: Address;
  billingAddress: Address;
}

export interface CustomerInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Address {
  address: string;
  address2nd: string;
  zipCode: number;
  city: string;
  country: string;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  @JoinColumn()
  @ApiProperty({ description: 'This is the content of the order' })
  orderItems: OrderItem[];

  @Column({ type: 'date', update: false, default: () => 'CURRENT_TIMESTAMP' })
  @IsDefined()
  @ApiProperty({ description: 'This is the time of the creation of the order' })
  orderDate: Date;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  @IsDefined()
  @ApiProperty({
    description: 'This is the last time there where any change to the order',
  })
  lastChange: Date;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the first name of the customer (to be updated with a User reference in the future)',
  })
  customerFirstName: string;

  @Column({ type: 'text' })
  @IsOptional()
  @ApiProperty({
    description:
      'This the middle name of the customer (to be updated with a User reference in the future)',
  })
  customerMiddleName: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the last name of the customer (to be updated with a User reference in the future)',
  })
  customerLastName: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the phone number of the customer (to be updated with a User reference in the future)',
  })
  customerPhone: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the email contact of the customer (to be updated with a User reference in the future)',
  })
  customerEmail: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the shipping address of the customer (to be updated with a User reference in the future)',
  })
  customerShippingAddress: string;

  @Column({ type: 'text' })
  @IsOptional()
  @ApiProperty({
    description:
      'This the shipping address, 2nd line if needed of the customer (to be updated with a User reference in the future)',
  })
  customerShipping2ndAddress: string;

  @Column({ type: 'int' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the shipping zip code of the customer (to be updated with a User reference in the future)',
  })
  customerShippingZipCode: number;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the shipping city of the customer (to be updated with a User reference in the future)',
  })
  customerShippingCity: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the shipping country of the customer (to be updated with a User reference in the future)',
  })
  customerShippingCountry: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'This the shipping notes in connection with the order if any ',
  })
  customerShippingNotes: string;

  @Column({ type: 'text' })
  @IsOptional()
  @ApiProperty({
    description:
      'This the billing address of the customer (to be updated with a User reference in the future)',
  })
  customerBillingAddress: string;

  @Column({ type: 'text' })
  @IsOptional()
  @ApiProperty({
    description:
      'This the billing address, 2nd line if needed of the customer (to be updated with a User reference in the future)',
  })
  customerBilling2ndAddress: string;

  @Column({ type: 'int' })
  @IsOptional()
  @ApiProperty({
    description:
      'This the billing zip code of the customer (to be updated with a User reference in the future)',
  })
  customerBillingZipCode: number;

  @Column({ type: 'text' })
  @IsOptional()
  @ApiProperty({
    description:
      'This the billing city of the customer (to be updated with a User reference in the future)',
  })
  customerBillingCity: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the shipping country of the customer (to be updated with a User reference in the future)',
  })
  customerBillingCountry: string;

  @Column({
    type: 'enum',
    enum: ['received', 'reserved', 'confirmed', 'packed', 'shipped', 'closed'],
    default: 'received',
  })
  @IsDefined()
  @ApiProperty({
    description:
      'This is a representation of the status of the order in the system',
  })
  orderStatus: string;

  constructor(partial: Partial<Order> = {}) {
    Object.assign(this, partial);
  }
}
