import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../../src/products/entities/product.entity';
import { ProductsController } from '../../src/products/products.controller';
import { ProductsService } from '../../src/products/products.service';
import {
  fakeDiamondRingItem,
  fakeTestProducts,
  diamondRingItem,
  fakeGlovesItem,
} from '../testObjects';

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
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: fakeProductsService }],
    }).compile();

    productController = module.get<ProductsController>(ProductsController);
  });

  describe('Initial test - Is it working?', () => {
    test('should be defined', () => {
      expect(productController).toBeDefined();
    });
  });

  describe('The Products Controller gets all the products as needed', () => {
    test('Get all products correctly', async () => {
      const products = await productController.getAll();
      expect.assertions(2);
      expect(products['products'].length).toBe(3);
      expect(products).toBeDefined();
    });

    test('Get only active products', async () => {
      const activeProducts = await productController.getActiveProducts();
      expect.assertions(2);
      expect(activeProducts['products'].length).toBe(1);
      expect(activeProducts.products[0].name).toBe(fakeGlovesItem.name);
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
    test('One products is correctly found in the database', async () => {
      const products = await productController.getAll();
      const wantedProduct = products.products.filter(
        (product) => product.name === fakeTestProducts[0].name,
      );
      const product = await productController.getOne(
        wantedProduct[0].id.toString(),
      );
      expect.assertions(2);
      expect(product).toBeDefined();
      expect(product.sku).toBe(fakeTestProducts[0].sku);
    });
    test('Invalid ID returns an error', async () => {
      fakeProductsService.getOne = () => null;

      try {
        await productController.getOne('2558');
      } catch (error) {
        expect.assertions(2);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toContain(
          'Product not found, or does not exists',
        );
      }
    });
  });
  describe('The product controller can create new products', () => {
    test('Create a new product works', async () => {
      const product = await productController.createOne(diamondRingItem);
      expect.assertions(3);
      expect(product).toBeDefined();
      expect(product.id).toBe(1);
      expect(product.name).toBe(diamondRingItem.name);
    });
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
