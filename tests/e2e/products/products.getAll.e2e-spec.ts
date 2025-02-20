/* istanbul ignore file */
import * as request from 'supertest';
// NestJS dependencies, to ensure the app works
import { INestApplication } from '@nestjs/common';

// Test objects
import { testProducts } from '../../testObjects';

import {
  setupDatabase,
  teardownDatabase,
  addProductsToDataBase,
  clearDatabase,
} from '../test-setup';

describe('IntegrationsTest for Products Get All - The integrationTest have been split into several file to keep the file length low', () => {
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

  describe('Get All Products', () => {
    test('Test of getAll, only active and stock > 0', async () => {
      expect.assertions(3);
      //* Ensure there is products in the endpoint
      const products = await request(app.getHttpServer())
        .get('/products')
        .query({ page: 1, limit: 10 })
        .expect(200);

      //* Only two product are both public and have quantity > 0.
      expect(products.body.products.length).toBe(2);
      expect(products.body.page).toBeDefined();
      expect(products.body.limit).toBeDefined();
    });

    test('Get all products without sorting', async () => {
      expect.assertions(3);
      //* Ensure there is products in the endpoint
      const products = await request(app.getHttpServer())
        .get('/products/all')
        .query({ page: 1, limit: 10 })
        .expect(200);

      //* Since we added four products, there should be four products in the endpoint.
      expect(products.body.products.length).toBe(4);
      expect(products.body.page).toBeDefined();
      expect(products.body.limit).toBeDefined();
    });
  });
});
