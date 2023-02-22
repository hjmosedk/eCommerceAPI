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
    test('A product is returned when :ID is called', async () => {
      const product = {
        id: 1,
        name: 'Diamantring',
        sku: 'DIA1',
        description: 'Dette er en ring af diamant',
        price: 5000,
        picture: 'Not implemened',
        quantity: 10,
      } as Product;

      const productRepositoryFindOneSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(product);

      const result = await productService.getOne(1);

      expect.assertions(2);
      expect(result).toBe(product);
      expect(productRepositoryFindOneSpy).toBeCalledWith({ where: { id: 1 } });
    });
    test('Wrong ID returns an error', async () => {
      const productRepositoryFindOneErrorSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(null);

      expect.assertions(2);

      const noProduct = await productService.getOne(1);
      expect(noProduct).toBe(null);
      expect(productRepositoryFindOneErrorSpy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('Test ProductModule, create new product', () => {
    test('Creating a new item is possible', async () => {
      const newProduct = {
        name: 'Cooking Stove',
        sku: 'STO1',
        description: 'This is a completely new stove',
        price: 5000,
        picture: 'Not implemened',
        quantity: 10,
      } as Product;

      const productRepositoryCreateNewSpy = jest
        .spyOn(productRepository, 'create')
        .mockReturnValue(newProduct);

      const productRepositorySaveNewSpy = jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue(newProduct);

      const resultNewProduct = await productService.createOne(newProduct);

      expect.assertions(3);

      expect(productRepositoryCreateNewSpy).toHaveBeenCalledWith(newProduct);
      expect(productRepositorySaveNewSpy).toHaveBeenCalledWith(newProduct);
      expect(resultNewProduct).toEqual(newProduct);
    });
  });
});