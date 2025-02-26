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

describe('IntegrationsTest for Create One Product- The integrationTest have been split into several file to keep the file length low', () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (app) {
      return app;
    }
    app = await setupDatabase();
  });

  beforeEach(async () => {
    await clearDatabase(app);
    await addProductsToDataBase(app, testProducts);
  });

  afterAll(async () => {
    await teardownDatabase(app);
  });

  describe('Create a new product', () => {
    test('Create a new product', async () => {
      const newTestItem = structuredClone(goldWatchItem);
      delete newTestItem.orderItems;

      expect.assertions(3);

      //* Ensure we can add a new product to the database
      const newProduct = await request(app.getHttpServer())
        .post('/products')
        .send(newTestItem)
        .expect(201);

      //* As the server response, the ID should now be defined.
      expect(newProduct.body.id).toBeDefined();

      //* Getting all product now, should result in a list of four products, the one test, and the three from the setup
      const products = await request(app.getHttpServer())
        .get('/products/all')
        .query({ page: 1, limit: 10 })
        .expect(200);

      //* Since we added a product, the length should be 5
      expect(products.body.products.length).toBe(5);
      //* Here we ensure the product added is the product we just added
      expect(products.body.products).toEqual(
        expect.arrayContaining([expect.objectContaining(newTestItem)]),
      );
    });

    test('Negative test - some test to ensure the server handles wrong items', async () => {
      const productDatabase = app.get(DataSource).getRepository(Product);
      await productDatabase.delete({});
      await request(app.getHttpServer()).get('/products').expect(404);
      await request(app.getHttpServer()).get('/products/1').expect(404);
      await request(app.getHttpServer())
        .patch('/products/1')
        .send(goldWatchItem)
        .expect(404);
      await request(app.getHttpServer())
        .post('/products')
        .send(wrongGlove)
        .expect(400);
    });
  });
});
