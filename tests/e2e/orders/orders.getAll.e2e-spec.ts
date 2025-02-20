/* istanbul ignore file */

import * as request from 'supertest';
// NestJS dependencies, to ensure the app works
import { INestApplication } from '@nestjs/common';

// Test objects
import { FakeCustomer, testProducts } from '../../testObjects';
// import { Product } from '../../src/products/entities/product.entity';
import { DataSource } from 'typeorm';

import {
  setupDatabase,
  teardownDatabase,
  clearDatabase,
  addProductsToDataBase,
} from '../test-setup';
import { Product } from 'src/products/entities/product.entity';
import { Customer } from 'src/orders/entities/customer.entity';
import { OrderItem } from '../../../src/orders/entities/orderItem.entity';
import { Order } from '../../../src/orders/entities/order.entity';

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

  try {
    await addOrdersToSystem(
      app,
      orderItems1,
      FakeCustomer,
      Ecommerce.CurrencyType.DKK,
      null,
      'awaiting_collection',
      '1235',
    );
    await addOrdersToSystem(
      app,
      orderItems2,
      FakeCustomer,
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

describe('IntegrationsTest for orders Get All - The integrationTest have been split into several file to keep the file size low', () => {
  test('Get all Orders from the /orders endpoint, GET test', async () => {
    const orders = await request(app.getHttpServer())
      .get('/orders')
      .query({ page: 1, limit: 10 })
      .expect(200);
    //* Since we have two orders, this must be 2

    expect(orders.body.orders.length).toBe(2);
  });

  test('There is no orders in the system - /Orders returns and error, GET test', async () => {
    const orderItemDatabase = app.get(DataSource).getRepository(OrderItem);
    const OrdersDatabase = app.get(DataSource).getRepository(Order);
    await orderItemDatabase.delete({});
    await OrdersDatabase.delete({});

    expect.assertions(2);
    //* Orders must be an error, as there is no orders in the system
    const orders = await request(app.getHttpServer())
      .get('/orders')
      .query({ page: 1, limit: 10 })
      .expect(404);

    expect(orders.body.error).toBe('Not Found');
    expect(orders.body.message).toBe('There is no orders in the system');
  });
});
