import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  //InsertResult,
  Repository,
} from 'typeorm';
import {
  //CurrencyType,
  Product,
  ProductRepositoryFake,
} from '../entities/product.entity';
import { ProductsService } from '../products.service';
import {
  fakeTestProducts,
  fakeDiamondRingItem,
  goldWatchItem,
  fakeGoldWatchItem,
} from '../../../test/testObjects';

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
      const productsRepositoryFindSpy = jest
        .spyOn(productRepository, 'find')
        .mockResolvedValue(fakeTestProducts);

      const result = await productService.getAll();

      expect.assertions(2);

      expect(result).toBe(fakeTestProducts);
      expect(productsRepositoryFindSpy).toHaveBeenCalled();
    });
    test('A product is returned when :ID is called', async () => {
      const productRepositoryFindOneSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(fakeDiamondRingItem);

      const result = await productService.getOne(1);

      expect.assertions(2);
      expect(result).toBe(fakeDiamondRingItem);
      expect(productRepositoryFindOneSpy).toBeCalledWith({ where: { id: 1 } });
    });
    test('Wrong ID returns an error', async () => {
      const productRepositoryFindOneErrorSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(null);

      expect.assertions(2);

      const noProduct = await productService.getOne(null);
      expect(noProduct).toBe(null);
      expect(productRepositoryFindOneErrorSpy).not.toBeCalled();
    });
  });

  describe('Test ProductModule, create new product', () => {
    test('Creating a new item is possible', async () => {
      const productRepositoryCreateNewSpy = jest
        .spyOn(productRepository, 'create')
        .mockReturnValue(fakeGoldWatchItem);

      const productRepositorySaveNewSpy = jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue(fakeGoldWatchItem);

      const resultNewProduct = await productService.createOne(goldWatchItem);

      expect.assertions(3);

      expect(productRepositoryCreateNewSpy).toHaveBeenCalledWith(goldWatchItem);
      expect(productRepositorySaveNewSpy).toHaveBeenCalledWith(
        fakeGoldWatchItem,
      );
      expect(resultNewProduct).toEqual(fakeGoldWatchItem);
    });
  });
});
