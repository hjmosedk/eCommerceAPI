import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

type newProduct = Omit<Product, 'id'>;
@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  getAll() {
    return this.repo.find();
  }

  getOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOne({ where: { id } });
  }

  createOne(product: Partial<Product>) {
    const newProduct = this.repo.create(product);
    return this.repo.save(newProduct);
  }

  createMany(products: newProduct[]) {
    const newProducts: newProduct[] = [];
    products.forEach((product) => {
      const newProduct = this.repo.create(product);
      newProducts.push(newProduct);
    });

    return this.repo.insert(newProducts);
  }
}
