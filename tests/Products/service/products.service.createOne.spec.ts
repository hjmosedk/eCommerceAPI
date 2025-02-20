import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../src/products/entities/product.entity';
import { ProductsService } from '../../../src/products/products.service';
import { goldWatchItem, fakeGoldWatchItem } from '../../testObjects';

describe('Products Service - Create Product - Tests have been split up in multiple files for maintainability', () => {
  let productService: ProductsService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    productService = module.get<ProductsService>(ProductsService);
    productRepository = module.get(getRepositoryToken(Product));
  });

  describe('Create Product', () => {
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
