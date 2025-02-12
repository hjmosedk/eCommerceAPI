/* istanbul ignore file */
import * as request from 'supertest';
// NestJS dependencies, to ensure the app works
import { INestApplication } from '@nestjs/common';

// Test objects
import { testProducts, goldWatchItem, wrongGlove } from '../../testObjects';
import { Product } from '../../../src/products/entities/product.entity';
import { DataSource } from 'typeorm';

import {
  setupDatabase,
  teardownDatabase,
  addProductsToDataBase,
  clearDatabase,
} from '../test-setup';

describe('IntegrationsTest for update status - The integrationTest have been split into several file to keep the file length low', () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (app) {
      return app;
    }
    app = await setupDatabase();
    //app = setupApp;
  });

  beforeEach(async () => {
    await clearDatabase(app);
    await addProductsToDataBase(app, testProducts);
  });

  afterAll(async () => {
    await teardownDatabase(app);
  });

  describe('Update the status of a product', () => {
    test('Update Status', async () => {
      expect.assertions(3);

      //* We must first get a product from the database, to ensure we can update it
      const updatedProductResponse = await request(app.getHttpServer())
        .get('/products')
        .query({ page: 1, limit: 10 })
        .expect(200);

      const updatedProduct = updatedProductResponse.body.products[0];
      const { id } = updatedProduct;

      const productUpdate = await request(app.getHttpServer())
        .post(`/products/${id}`)
        .expect(201);

      //* ensure the two products are not the same
      expect(productUpdate.body).not.toEqual(updatedProduct);
      expect(productUpdate.body.isPublic).not.toEqual(updatedProduct.isPublic);

      //* Ensure the updated product is "correctly updated"
      const updatedProductAfterUpdateResponse = await request(
        app.getHttpServer(),
      )
        .get(`/products/${id}`)
        .expect(200);

      const updatedProductAfterUpdate = updatedProductAfterUpdateResponse.body;

      //* Not the same
      expect(updatedProductAfterUpdate.isPublic).not.toEqual(
        updatedProduct.isPublic,
      );
    });
    test('An error is thrown if id does not', async () => {
      expect.assertions(1);

      const productUpdate = await request(app.getHttpServer())
        .post(`/products/999999`)
        .expect(404);

      expect(productUpdate.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'Product does not exits',
      });
    });
  });
});
