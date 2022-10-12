import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductRepositoryFake } from './entities/product.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let productService: ProductsService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: ProductRepositoryFake,
        },
      ],
    }).compile();

    productService = module.get<ProductsService>(ProductsService);
    productRepository = module.get(getRepositoryToken(Product));
  });

  describe('Initial test - Is it working?', () => {
    test('should be defined', () => {
      expect(productService).toBeDefined();
    });
  });

  describe('Test productModule - Get items', () => {
    test('The correct list of products is generated', async () => {
      const products = [
        {
          id: 1,
          name: 'Diamantring',
          sku: 'DIA1',
          description: 'Dette er en ring af diamant',
          price: 5000,
          picture: 'Not implemened',
          quantity: 10,
        } as Product,
        {
          id: 2,
          name: 'Cheeseburger',
          sku: 'CHE1',
          description: 'Dette er en cheecburger',
          price: 49,
          picture: 'Not implemened',
          quantity: 10,
        } as Product,
        {
          id: 3,
          name: 'Handsker',
          sku: 'HAN1',
          description: 'Dette er et par handsker',
          price: 25,
          picture: 'Not implemened',
          quantity: 10,
        } as Product,
      ];
      const productsRepositoryFindSpy = jest
        .spyOn(productRepository, 'find')
        .mockResolvedValue(products);

      const result = await productService.getAll();

      expect.assertions(2);

      expect(result).toBe(products);
      expect(productsRepositoryFindSpy).toHaveBeenCalled();
    });
  });
});
