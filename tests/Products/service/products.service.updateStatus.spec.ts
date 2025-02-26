import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../src/products/entities/product.entity';
import { ProductsService } from '../../../src/products/products.service';
import { fakeDiamondRingItem } from '../../testObjects';
import { NotFoundException } from '@nestjs/common';

describe('Products Service - Update Status - Tests have been split up in multiple files for maintainability', () => {
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

  test('updateStatus - Works as expected', async () => {
    const fakeProduct = structuredClone(fakeDiamondRingItem);
    const productId = fakeProduct.id;
    delete fakeProduct.isPublic;
    const productRepositoryFindOneSpy = jest
      .spyOn(productRepository, 'findOne')
      .mockResolvedValue(fakeProduct);
    const productRepositorySaveOneSpy = jest
      .spyOn(productRepository, 'save')
      .mockResolvedValue({ ...fakeProduct, isPublic: false });

    const updatedProduct = await productService.updateStatus(productId);

    expect(productRepositoryFindOneSpy).toHaveBeenCalledWith({
      where: { id: productId },
    });

    expect(productRepositorySaveOneSpy).toHaveBeenCalledWith(
      expect.objectContaining({ isPublic: true }),
    );
    expect(updatedProduct).toEqual(
      expect.objectContaining({ ...fakeProduct, isPublic: false }),
    );
  });
  test('updateStatus - Product not found', async () => {
    const productId = 123;
    const productRepositoryFindOneSpy = jest
      .spyOn(productRepository, 'findOne')
      .mockResolvedValue(null);
    expect.assertions(3);
    try {
      await productService.updateStatus(productId);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Product does not exits');
    }
    expect(productRepositoryFindOneSpy).toHaveBeenCalledWith({
      where: { id: productId },
    });
  });
});
