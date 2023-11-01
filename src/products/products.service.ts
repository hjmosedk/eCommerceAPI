import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

type newProduct = Omit<Product, 'id'>;
@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async getAll() {
    const products = await this.repo.find();

    if (!products) {
      return null;
    }

    return products;
  }

  async getActiveProducts() {
    const allProducts = await this.getAll();

    if (!allProducts) {
      return null;
    }

    const publicProducts = allProducts.filter(
      (product) => product.isPublic === true,
    );

    const activeProducts = publicProducts.filter(
      (product) => product.quantity > 0,
    );

    return activeProducts;
  }

  async getOne(id: number) {
    if (!id) {
      return null;
    }

    return await this.repo.findOne({ where: { id } });
  }

  async createOne(product: Partial<newProduct>) {
    const newProduct = this.repo.create(product);
    return await this.repo.save(newProduct);
  }

  async clearDatabase() {
    try {
      this.repo.clear();
    } catch (error) {
      throw new Error(`Error cleaning database: ${error.message}`);
    }
  }

  /* istanbul ignore next */
  async createMany(products: newProduct[]) {
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
    return await this.repo.insert(newProducts);
  }

  async updateProduct(id: number, attrs: Partial<Product>) {
    const product = await this.repo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    Object.assign(product, attrs);
    return await this.repo.save(product);
  }

  async updateStatus(id: number) {
    const product = await this.repo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product does not exits');
    }

    product.isPublic = !product.isPublic;
    return await this.repo.save(product);
  }
}
