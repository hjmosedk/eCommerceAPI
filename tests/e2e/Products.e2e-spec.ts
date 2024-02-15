/* istanbul ignore file */
import * as request from 'supertest';
// NestJS dependencies, to ensure the app works
import { INestApplication } from '@nestjs/common';

// Test objects
import { testProducts, goldWatchItem, wrongGlove } from '../testObjects';
import { Product } from '../../src/products/entities/product.entity';
import { DataSource } from 'typeorm';

import {
  setupDatabase,
  teardownDatabase,
  addProductsToDataBase,
  clearDatabase,
} from './test-setup';

describe('IntegrationsTest for products module', () => {
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

  test('Get all products from the /products endpoint, GET test', async () => {
    expect.assertions(1);
    //* Ensure there is products in the endpoint
    const products = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    //* Only two product are both public and have quantity > 0.
    expect(products.body.length).toBe(2);
  });

  test('Get all products from the /products/all endpoint, GET test', async () => {
    expect.assertions(1);
    //* Ensure there is products in the endpoint
    const products = await request(app.getHttpServer())
      .get('/products/all')
      .expect(200);

    //* Since we added four products, there should be four products in the endpoint.
    expect(products.body.length).toBe(4);
  });

  test('Create a new product from the /products endpoint, POST test', async () => {
    const newTestItem = { ...goldWatchItem };
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
      .expect(200);

    //* Since we added a product, the length should be 5
    expect(products.body.length).toBe(5);
    //* Here we ensure the product added is the product we just added
    expect(products.body).toEqual(
      expect.arrayContaining([expect.objectContaining(newTestItem)]),
    );
  });

  test('Get one product by ID from the /products/id endpoint, GET test', async () => {
    expect.assertions(2);
    const productList = await request(app.getHttpServer())
      .get('/products')
      .expect(200);
    const productListLength = productList.body.length;

    //* Generate a random id to make sure all id in the array can be found
    const randomId = Math.floor(Math.random() * productListLength);
    //* Creates a list, to ensure the product found is viable

    const productId = productList.body[randomId].id;

    const foundProduct = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(200);
    //* if a product is found, it should be defined!
    expect(foundProduct.body).toBeDefined();

    expect(productList.body[randomId]).toEqual(foundProduct.body);
  });

  test('Update a product from ID via the /products/id endpoint, PATCH test', async () => {
    expect.assertions(4);

    //* We must first get a product from the database, to ensure we can update it
    const updatedProductResponse = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    const updatedProduct = updatedProductResponse.body[0];

    const { id } = updatedProduct;

    //* Update the wanted product
    const updatedData = {
      ...updatedProduct,
      onSale: true,
      percentage: 35,
    };

    const productUpdate = await request(app.getHttpServer())
      .patch(`/products/${id}`)
      .send(updatedData)
      .expect(200);

    //* ensure the two products are not the same
    expect(productUpdate).not.toEqual(updatedProduct);
    expect(productUpdate.body.onSale).toEqual(true);
    expect(productUpdate.body.percentage).toBe(35);

    //* Ensure the updated product is "correctly updated"
    const updatedProductAfterUpdateResponse = await request(app.getHttpServer())
      .get(`/products/${id}`)
      .expect(200);

    const updatedProductAfterUpdate = updatedProductAfterUpdateResponse.body;

    //* Not the same
    expect(updatedProductAfterUpdate).toEqual(updatedData);
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
