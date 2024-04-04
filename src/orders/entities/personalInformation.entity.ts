import { Entity, Column } from 'typeorm';
import { IsDefined, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Ecommerce } from 'ckh-typings';

@Entity('PersonalInformation')
export class PersonalInformation implements Ecommerce.PersonalInformationModel {
  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the first name of the customer (to be updated with a User reference in the future)',
  })
  firstName: string;

  @Column({ type: 'text' })
  @IsOptional()
  @ApiProperty({
    description:
      'This the middle name of the customer (to be updated with a User reference in the future)',
  })
  middleName: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the last name of the customer (to be updated with a User reference in the future)',
  })
  lastName: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the phone number of the customer (to be updated with a User reference in the future)',
  })
  phone: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This the email contact of the customer (to be updated with a User reference in the future)',
  })
  email: string;

  constructor(partial: Partial<PersonalInformation> = {}) {
    Object.assign(this, partial);
  }
}
