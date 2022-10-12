import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  required: true;

  @Column()
  sku: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ length: 3, default: 'DKK' })
  currency: string;

  @Column()
  picture: string;

  @Column({ default: 10 })
  quantity: number;
}

export class ProductRepositoryFake {
  public async find(): Promise<void> {
    [];
  }
}
