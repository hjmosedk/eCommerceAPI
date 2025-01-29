import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../src/products/entities/product.entity';
import { ProductsService } from '../../../src/products/products.service';
import { fakeDiamondRingItem } from '../../testObjects';

import { NotFoundException } from '@nestjs/common';

describe('Products Service - Update Product - Tests have been split up in multiple files for maintainability', () => {
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

  describe('Update Product', () => {
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

      expect(productRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: productId },
      });
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
