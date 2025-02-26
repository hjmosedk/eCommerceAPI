import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../src/products/entities/product.entity';
import { ProductsService } from '../../../src/products/products.service';
import { fakeDiamondRingItem } from '../../testObjects';

describe('ProductsService - Get One Product defined by ID test - Tests have been split up in multiple files for maintainability', () => {
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

  describe('ProductsService - Get One Product defined by ID test', () => {
    test('A product is returned when :ID is called', async () => {
      const productRepositoryFindOneSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(fakeDiamondRingItem);

      const result = await productService.getOne(1);

      expect.assertions(2);
      expect(result).toBe(fakeDiamondRingItem);
      expect(productRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
    test('Wrong ID returns an error', async () => {
      const productRepositoryFindOneErrorSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(null);

      expect.assertions(2);

      const noProduct = await productService.getOne(null);
      expect(noProduct).toBe(null);
      expect(productRepositoryFindOneErrorSpy).not.toHaveBeenCalled();
    });
  });
});
