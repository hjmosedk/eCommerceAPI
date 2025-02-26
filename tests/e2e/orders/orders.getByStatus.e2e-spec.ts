/* istanbul ignore file */

import * as request from 'supertest';
// NestJS dependencies, to ensure the app works
import { INestApplication } from '@nestjs/common';

// Test objects
import { FakeCustomer, testProducts } from '../../testObjects';

import {
  setupDatabase,
  teardownDatabase,
  clearDatabase,
  addProductsToDataBase,
} from '../test-setup';
import { Product } from 'src/products/entities/product.entity';
import { Customer } from 'src/orders/entities/customer.entity';
import { OrderItem } from '../../../src/orders/entities/orderItem.entity';

import { Ecommerce } from 'ckh-typings';

const getItemsForOrder = async (
  app: INestApplication,
  noOfItems: number,
): Promise<null | OrderItem[]> => {
  const orderItems = await request(app.getHttpServer())
    .get('/products')
    .query({ page: 1, limit: 10 });

  const endIndex = Math.min(noOfItems, orderItems.body.products.length);

  if (!orderItems || orderItems.body.products.length < noOfItems) {
    return null;
  }

  if (noOfItems === 0) {
    return orderItems.body;
  }

  const itemsForOrder: Product[] = orderItems.body.products.slice(0, endIndex);
  const allItems = [];
  itemsForOrder.forEach((product) => {
    const orderItem: Omit<Ecommerce.OrderItemModel, 'productId' | 'product'> = {
      salesQuantity: Math.floor(Math.random() * 10) + 1,
      id: product.id,
      price: product.price,
    };

    allItems.push(orderItem);
  });

  return allItems;
};

const addOrdersToSystem = async (
  app: INestApplication,
  orderItems: OrderItem[],
  customer: Customer,
  orderCurrency: Ecommerce.CurrencyType,
  orderNotes: string | null,
  paymentStatus: string,
  paymentId: string,
): Promise<void> => {
  try {
    const order = await request(app.getHttpServer()).post('/orders').send({
      orderItems,
      customer,
      orderCurrency,
      orderNotes,
      paymentStatus,
      paymentId,
    });

    if (!order.body) {
      throw new Error('Failed to created order');
    }
  } catch (error) {
    console.log(error.message);
  }
};

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
  const orderItems1 = await getItemsForOrder(app, 1);
  const orderItems2 = await getItemsForOrder(app, 2);

  const email = process.env.FROM_EMAIL;
  const testCustomer = { ...FakeCustomer };
  testCustomer.personalInformation.email = email;

  try {
    await addOrdersToSystem(
      app,
      orderItems1,
      testCustomer,
      Ecommerce.CurrencyType.DKK,
      null,
      'awaiting_collection',
      '1235',
    );
    await addOrdersToSystem(
      app,
      orderItems2,
      testCustomer,
      Ecommerce.CurrencyType.DKK,
      null,
      'awaiting_collection',
      '1235',
    );
  } catch (error) {
    console.log(error);
    fail('No orders where created');
  }
});

afterAll(async () => {
  await teardownDatabase(app);
});

describe('IntegrationsTest for orders Get All By Status - The integrationTest have been split into several file to keep the file size low', () => {
  test('The system can return only orders with a relevant status - /Orders?status=status returns orders, GET test', async () => {
    expect.assertions(1);

    await request(app.getHttpServer())
      .get(`/orders/status/${Ecommerce.OrderStatus.SHIPPED}`)
      .query({ page: 1, limit: 25 })
      .expect(404);

    const orders = await request(app.getHttpServer())
      .get(`/orders/status/${Ecommerce.OrderStatus.RECEIVED}`)
      .query({ page: 1, limit: 25 })
      .expect(200);

    expect(orders.body.orders.length).toBe(2);
  });
  test('Negative test - OrderStatus cannot be randomText or info', async () => {
    await request(app.getHttpServer())
      .get(`/orders/status/HellWorld`)
      .query({ page: 1, limit: 25 })
      .expect(400);

    await request(app.getHttpServer()).get(`/orders/status/123456`).expect(400);
  });
});
