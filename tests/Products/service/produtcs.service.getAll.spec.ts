import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../src/products/entities/product.entity';
import { ProductsService } from '../../../src/products/products.service';
import { fakeTestProducts } from '../../testObjects';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProductsService - Get all test - Test have been split up in multiple files for maintainability', () => {
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

  describe('Get All ', () => {
    test('Invalid page number or limited throws BadRequestException', async () => {
      expect.assertions(2);
      await expect(productService.getAll(NaN, 25)).rejects.toThrow(
        new BadRequestException('Invalid page or limit number').message,
      );
      await expect(productService.getAll(1, NaN)).rejects.toThrow(
        new BadRequestException('Invalid page or limit number').message,
      );
    });
    test('The correct list of products is generated', async () => {
      const newFakeTestProducts = structuredClone(fakeTestProducts);

      const productsRepositoryFindSpy = jest
        .spyOn(productRepository, 'findAndCount')
        .mockResolvedValue([newFakeTestProducts, newFakeTestProducts.length]);

      const result = await productService.getAll(1, 25);

      expect.assertions(3);

      expect(result[0]).toEqual(newFakeTestProducts);
      expect(result[1]).toBe(newFakeTestProducts.length);
      expect(productsRepositoryFindSpy).toHaveBeenCalled();
    });
    test('No product in database returns an error', async () => {
      const productRepositoryFindSpy = jest
        .spyOn(productRepository, 'findAndCount')
        .mockResolvedValue([[], 0]);

      await expect(productService.getActiveProducts(1, 15)).rejects.toThrow(
        NotFoundException,
      );

      await expect(productService.getAll(1, 15)).rejects.toThrow(
        NotFoundException,
      );

      expect.assertions(3);

      expect(productRepositoryFindSpy).toHaveBeenCalled();
    });
  });
});
