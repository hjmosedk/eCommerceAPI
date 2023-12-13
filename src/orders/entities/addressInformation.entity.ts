import { Entity, Column } from 'typeorm';
import { IsDefined, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AddressInformation {
  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This is the information about the address - As it can be used in several places, it is generic here',
  })
  address: string;

  @Column({ type: 'text' })
  @IsOptional()
  @ApiProperty({
    description:
      'This is the information about the address, 2nd line - As it can be used in several places, it is generic here',
  })
  address2nd: string;

  @Column({ type: 'int' })
  @IsDefined()
  @ApiProperty({
    description:
      'This is the information about the zipCode - As it can be used in several places, it is generic here',
  })
  zipCode: number;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This is the information about the city - As it can be used in several places, it is generic here',
  })
  city: string;

  @Column({ type: 'text' })
  @IsDefined()
  @ApiProperty({
    description:
      'This is the information about the country - As it can be used in several places, it is generic here',
  })
  country: string;

  constructor(partial: Partial<AddressInformation> = {}) {
    Object.assign(this, partial);
  }
}
