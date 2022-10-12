import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

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
}
