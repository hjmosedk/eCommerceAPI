/* istanbul ignore file */
// Testing dependencies
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
// NestJS dependencies, to ensure the app works
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../app.module';

// Services to be used for testing
import { ProductsService } from '../products.service';

// Test objects
import {
  testProducts,
  goldWatchItem,
  wrongGlove,
} from '../../../test/testObjects';
import { Product } from '../entities/product.entity';
import { DataSource } from 'typeorm';

describe('e2e test for products module', () => {
  let app: INestApplication;
  let productService: ProductsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    productService = app.get(ProductsService);

    //* Add a list of products to the database
    await productService.createMany(testProducts);
  });

  afterAll(async () => {
    await app.close();
  });

  test('get all products from the /products endpoint, GET test', async () => {
    expect.assertions(1);
    //* Ensure there is products in the endpoint
    const products = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    //* Since we added three products, there should be three products in the endpoint.
    expect(products.body.length).toBe(3);
  });

  test('create a new product from the /products endpoint, POST test', async () => {
    expect.assertions(3);

    //* Ensure we can add a new product to the database
    const newProduct = await request(app.getHttpServer())
      .post('/products')
      .send(goldWatchItem)
      .expect(201);

    //* As the server response, the ID should now be defined.
    expect(newProduct.body.id).toBeDefined();

    //* Getting all product now, should result in a list of four products, the one test, and the three from the setup
    const products = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    //* Since we added a product, the length should be 4
    expect(products.body.length).toBe(4);
    //* Here we ensure the product added is the product we just added
    expect(products.body).toEqual(
      expect.arrayContaining([expect.objectContaining(goldWatchItem)]),
    );
  });

  test('get one product by ID from the /products/id endpoint, GET test', async () => {
    expect.assertions(2);
    //* Generate a random id to make sure all id in the array can be found
    const id = Math.floor(Math.random() * 4) + 1;
    //* Creates a list, to ensure the product found is viable
    const productList = testProducts;
    productList.push(goldWatchItem);

    const foundProduct = await request(app.getHttpServer())
      .get(`/products/${id}`)
      .expect(200);

    //* if a product is found, it should be defined!
    expect(foundProduct.body).toBeDefined();

    const controlProduct: Product = { ...productList[id - 1], id: id };

    expect(controlProduct).toEqual(foundProduct.body);
  });

  test('update a product from ID via the /products/id endpoint, PATCH test', async () => {
    expect.assertions(4);

    //* We must first get a product from the database, to ensure we can update it
    const updatedProductResponse = await request(app.getHttpServer())
      .get('/products/2')
      .expect(200);

    const updatedProduct = updatedProductResponse.body;

    //* Update the wanted product
    const updatedData = {
      ...updatedProduct,
      onSale: true,
      percentage: 35,
    };

    const productUpdate = await request(app.getHttpServer())
      .patch('/products/2')
      .send(updatedData)
      .expect(200);

    //* ensure the two products are not the same
    expect(productUpdate).not.toEqual(updatedProduct);
    expect(productUpdate.body.onSale).toEqual(true);
    expect(productUpdate.body.percentage).toBe(35);

    //* Ensure the updated product is "stuck"
    const updatedProductAfterUpdateResponse = await request(app.getHttpServer())
      .get('/products/2')
      .expect(200);

    const updatedProductAfterUpdate = updatedProductAfterUpdateResponse.body;

    //* Not the same
    expect(updatedProductAfterUpdate).toEqual(updatedData);
  });

  test('negative test - some test to ensure the server handles wrong items', async () => {
    const productDatabase = app.get(DataSource).getRepository(Product);
    await productDatabase.clear();
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
