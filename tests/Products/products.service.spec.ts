import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  //InsertResult,
  Repository,
} from 'typeorm';
import {
  Product,
  ProductRepositoryFake,
} from '../../src/products/entities/product.entity';
import { ProductsService } from '../../src/products/products.service';
import {
  fakeTestProducts,
  fakeDiamondRingItem,
  goldWatchItem,
  fakeGoldWatchItem,
} from '../testObjects';
import { NotFoundException } from '@nestjs/common';

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
    test('Only the active product is returned', async () => {
      const productsRepositoryFindSpy = jest
        .spyOn(productRepository, 'find')
        .mockResolvedValue(fakeTestProducts);

      const result = await productService.getActiveProducts();

      expect.assertions(2);
      expect(result.length).toBe(1);
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

  describe('Test ProductModule, update product', () => {
    test('Product not found error, when id is not correct', async () => {
      const productId = 123;
      const productRepositoryFindOneSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(null);

      expect.assertions(3);
      try {
        await productService.updateProduct(productId, {});
        expect(true).toBe(false); //* If this code is reached, something is wrong and the test should fail
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Product does not exist');
      }

      expect(productRepositoryFindOneSpy).toBeCalledWith({
        where: { id: productId },
      });
    });
    test('Updating products, works as expected', async () => {
      const productId = fakeDiamondRingItem.id;
      const updateAttrs = {
        onSale: true,
        percentage: 35,
      };

      const productRepositoryFindOneSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(fakeDiamondRingItem);
      const productRepositorySaveOneSpy = jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue({ ...fakeDiamondRingItem, ...updateAttrs });

      const updatedProduct = await productService.updateProduct(
        productId,
        updateAttrs,
      );

      expect(productRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: productId },
      });

      expect(productRepositorySaveOneSpy).toHaveBeenCalledWith(
        expect.objectContaining(updateAttrs),
      );

      expect(updatedProduct).toEqual(
        expect.objectContaining({ ...fakeDiamondRingItem, ...updateAttrs }),
      );
    });
  });
});
