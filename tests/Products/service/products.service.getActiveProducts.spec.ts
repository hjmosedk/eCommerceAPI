import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../src/products/entities/product.entity';
import { ProductsService } from '../../../src/products/products.service';
import { fakeTestProducts } from '../../testObjects';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProductsService - Get all Active Products test - Tests have been split up in multiple files for maintainability', () => {
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

  describe('Get All Active Products', () => {
    test('Invalid page number or limited throws BadRequestException', async () => {
      expect.assertions(2);
      await expect(productService.getActiveProducts(NaN, 25)).rejects.toThrow(
        new BadRequestException('Invalid page or limit number').message,
      );

      await expect(productService.getActiveProducts(1, NaN)).rejects.toThrow(
        new BadRequestException('Invalid page or limit number').message,
      );
    });
    test('Only the active product is returned', async () => {
      const fakePublicProducts = fakeTestProducts.filter(
        (product) => product.isPublic === true,
      );
      const fakeActiveProducts = fakePublicProducts.filter(
        (product) => product.quantity > 0,
      );

      const productsRepositoryFindSpy = jest
        .spyOn(productRepository, 'findAndCount')
        .mockResolvedValue([fakeActiveProducts, fakeActiveProducts.length]);

      const result = await productService.getActiveProducts(1, 15);

      expect.assertions(2);
      expect(result[0].length).toBe(1);
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
