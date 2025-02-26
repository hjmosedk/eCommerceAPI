import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../../../src/products/entities/product.entity';
import { ProductsController } from '../../../src/products/products.controller';
import { ProductsService } from '../../../src/products/products.service';
import { fakeDiamondRingItem, fakeTestProducts } from '../../testObjects';

type newProduct = Omit<Product, 'id'>;

describe('Products Controller - Get All Products - Tests have been split up in multiple files for maintainability', () => {
  let productController: ProductsController;
  let fakeProductsService: Partial<ProductsService>;

  const mockedProducts = structuredClone(fakeTestProducts);

  const mockedProduct = structuredClone(fakeDiamondRingItem);

  beforeEach(async () => {
    fakeProductsService = {
      getAll: (page, limit) => {
        return Promise.resolve([mockedProducts, mockedProducts.length]);
      },
      getActiveProducts: () => {
        const publicProducts = mockedProducts.filter(
          (product) => product.isPublic == true,
        );

        const activeProducts = publicProducts.filter(
          (product) => product.quantity > 0,
        );

        return Promise.resolve([activeProducts, activeProducts.length]);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getOne: (_id: number) => {
        return Promise.resolve(mockedProduct);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      createOne: (_product: newProduct) => {
        return Promise.resolve(mockedProduct);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updateProduct: (_id: number, _attrs: Partial<Product>) => {
        return Promise.resolve(mockedProduct);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updateStatus: (_id: number) => {
        mockedProduct.isPublic = false;
        return Promise.resolve(mockedProduct);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: fakeProductsService }],
    }).compile();

    productController = module.get<ProductsController>(ProductsController);
  });

  describe('Get All Products Method test', () => {
    test('Get all products correctly', async () => {
      const products = await productController.getAll();
      expect.assertions(2);
      expect(products['products'].length).toBe(3);
      expect(products).toBeDefined();
    });
    test('No products returns an error', async () => {
      fakeProductsService.getAll = () => Promise.resolve([[], 0]);

      try {
        await productController.getAll();
      } catch (error) {
        expect.assertions(2);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toContain('There is no products in the database');
      }
    });
  });
});
