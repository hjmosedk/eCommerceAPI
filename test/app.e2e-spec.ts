import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ProductsService } from '../src/products/products.service';
import { CurrencyType, Product } from '../src/products/entities/product.entity';

type newProduct = Omit<Product, 'id'>;

describe('AppController (e2e)', () => {
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

    const testProducts: newProduct[] = [
      {
        name: 'Diamantring',
        sku: 'DIA1',
        description: 'Dette er en ring af diamant',
        category: 'Clothes',
        price: 5000,
        currency: CurrencyType.DKK,
        picture: 'Not implemened',
        quantity: 10,
      },
      {
        name: 'Cheeseburger',
        sku: 'CHE1',
        description: 'Dette er en cheecburger',
        category: 'Food',
        price: 4900,
        currency: CurrencyType.DKK,
        picture: 'Not implemened',
        quantity: 10,
      },
      {
        name: 'Handsker',
        sku: 'HAN1',
        description: 'Dette er et par handsker',
        category: 'Clothes',
        price: 2500,
        currency: CurrencyType.DKK,
        picture: 'Not implemened',
        quantity: 10,
      },
    ];

    const test = await productService.createMany(testProducts);
    console.log(test);
    return test;
  });

  afterAll(async () => {
    await app.close();
  });

  test('/products returns a list of products', async () => {
    const products = await request(app.getHttpServer())
      .get('/products')
      .expect(200);
    console.log(
      `This is the response from product ${JSON.stringify(products.body)}`,
    );
    expect(products.body.length).toBe(3);
  });
});
