import { Injectable, NotFoundException } from '@nestjs/common';
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

  createOne(product: Partial<newProduct>) {
    const newProduct = this.repo.create(product);
    return this.repo.save(newProduct);
  }

  async clearDatabase() {
    try {
      this.repo.clear();
    } catch (error) {
      throw new Error(`Error cleaning database: ${error.message}`);
    }
  }

  /* istanbul ignore next */
  createMany(products: newProduct[]) {
    /* istanbul ignore next */
    const newProducts: newProduct[] = [];
    /* istanbul ignore next */
    products.forEach((product) => {
      /* istanbul ignore next */
      const newProduct = this.repo.create(product);
      /* istanbul ignore next */
      newProducts.push(newProduct);
    });
    /* istanbul ignore next */
    return this.repo.insert(newProducts);
  }

  async updateProduct(id: number, attrs: Partial<Product>) {
    const product = await this.repo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    Object.assign(product, attrs);
    return await this.repo.save(product);
  }
}
