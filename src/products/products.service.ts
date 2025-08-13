import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

type newProduct = Omit<Product, 'id'>;
@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  /* istanbul ignore next*/
  //function does not need to be tested, as it is only used for e2e test, should not work in production.
  async clearDatabase() {
    /* istanbul ignore next*/
    try {
      /* istanbul ignore next*/
      this.repo.createQueryBuilder().delete().execute();
      /* istanbul ignore next*/
    } catch (error) {
      /* istanbul ignore next*/
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

  async getAll(page: number, limit: number): Promise<[Product[], number]> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Invalid page or limit number');
    }

    const [products, totalCount] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!products.length) {
      throw new NotFoundException('There is no products in the system');
    }

    return [products, totalCount];
  }

  async getActiveProducts(
    page: number,
    limit: number,
  ): Promise<[Product[], number]> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Invalid page or limit number');
    }

    const [activeProducts, totalCount] = await this.repo.findAndCount({
      where: { quantity: MoreThan(0), isPublic: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!activeProducts.length) {
      throw new NotFoundException('There is no products in the system');
    }

    return [activeProducts, totalCount];
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
