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

describe('IntegrationsTest for Products Get By Id - The integrationTest have been split into several file to keep the file length low', () => {
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

  describe('Get product by ID', () => {
    test('Get one product from ID', async () => {
      expect.assertions(2);
      const productList = await request(app.getHttpServer())
        .get('/products')
        .query({ page: 1, limit: 10 })
        .expect(200);
      const productListLength = productList.body.products.length;

      //* Generate a random id to make sure all id in the array can be found
      const randomId = Math.floor(Math.random() * productListLength);
      //* Creates a list, to ensure the product found is viable

      const productId = productList.body.products[randomId].id;

      const foundProduct = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);
      //* if a product is found, it should be defined!

      expect(foundProduct.body).toBeDefined();
      expect(productList.body.products[randomId]).toEqual(foundProduct.body);
    });
    test('No product found', async () => {
      expect.assertions(1);
      const productId = 999999;
      const foundProduct = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(404);

      expect(foundProduct.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'Product not found, or does not exists',
      });
    });
  });
});
