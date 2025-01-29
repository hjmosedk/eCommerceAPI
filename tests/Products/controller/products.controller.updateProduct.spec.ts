import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../../../src/products/entities/product.entity';
import { ProductsController } from '../../../src/products/products.controller';
import { ProductsService } from '../../../src/products/products.service';
import { fakeDiamondRingItem, fakeTestProducts } from '../../testObjects';

type newProduct = Omit<Product, 'id'>;

describe('ProductsController', () => {
  let productController: ProductsController;
  let fakeProductsService: Partial<ProductsService>;

  beforeEach(async () => {
    fakeProductsService = {
      getAll: (page, limit) => {
        return Promise.resolve([fakeTestProducts, fakeTestProducts.length]);
      },
      getActiveProducts: () => {
        const publicProducts = fakeTestProducts.filter(
          (product) => product.isPublic == true,
        );

        const activeProducts = publicProducts.filter(
          (product) => product.quantity > 0,
        );

        return Promise.resolve([activeProducts, activeProducts.length]);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getOne: (_id: number) => {
        return Promise.resolve(fakeDiamondRingItem);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      createOne: (_product: newProduct) => {
        return Promise.resolve(fakeDiamondRingItem);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updateProduct: (_id: number, _attrs: Partial<Product>) => {
        return Promise.resolve(fakeDiamondRingItem);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updateStatus: (_id: number) => {
        fakeDiamondRingItem.isPublic = false;
        return Promise.resolve(fakeDiamondRingItem);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: fakeProductsService }],
    }).compile();

    productController = module.get<ProductsController>(ProductsController);
  });

  describe('Patch function of the controller is working', () => {
    test('sku cannot be updated', async () => {
      fakeProductsService.updateProduct = () =>
        Promise.reject({
          message: 'The sku used is already in use, must be unique',
          status: 409,
        });

      const updatedProduct = { ...fakeDiamondRingItem, sku: 14 };

      try {
        await productController.updateProduct('14', updatedProduct);
      } catch (error) {
        expect.assertions(2);
        expect(error.message).toContain(
          'The sku used is already in use, must be unique',
        );
        expect(error.status).toBe(409);
      }
    });
  });
});
