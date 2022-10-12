import { Test, TestingModule } from '@nestjs/testing';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let productController: ProductsController;
  let fakeProductsService: Partial<ProductsService>;

  beforeEach(async () => {
    fakeProductsService = {
      getAll() {
        return Promise.resolve([
          {
            id: 1,
            name: 'testProduct',
            sku: 'testSKU1',
            description: 'This is just a test',
            price: 2558,
            picture: 'not yet',
            quantity: 10,
          } as Product,
          {
            id: 2,
            name: 'testProduct2',
            sku: 'testSKU2',
            description: 'There is some new text here',
            price: 3000,
            picture: 'not yet',
            quantity: 10,
          } as Product,
          {
            id: 3,
            name: 'testProduct3',
            sku: 'testSKU3',
            description: 'This is the last description',
            price: 4000,
            picture: 'not yet',
            quantity: 25,
          } as Product,
        ]);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getOne(_id: number) {
        return Promise.resolve({
          id: 1,
          name: 'testProduct',
          sku: 'testSKU1',
          description: 'This is just a test',
          price: 2558,
          picture: 'not yet',
          quantity: 10,
        } as Product);
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
      expect(products.length).toBe(3);
      expect(products).toBeDefined();
    });

    test('One products is correctly found in the database', async () => {
      const products = await productController.getAll();
      const product = await productController.getOne(products[0].id.toString());
      expect.assertions(2);
      expect(product).toBeDefined();
      expect(product.sku).toBe('testSKU1');
    });
    test('Invalid ID returns an error', async () => {
      fakeProductsService.getOne = () => null;

      try {
        await productController.getOne('2558');
      } catch (error) {}
    });
  });
});
