/* istanbul ignore file */

import * as request from 'supertest';
// NestJS dependencies, to ensure the app works
import { INestApplication } from '@nestjs/common';

// Test objects
import { FakeCustomer, testProducts } from '../testObjects';
// import { Product } from '../../src/products/entities/product.entity';
import { DataSource } from 'typeorm';

import {
  setupDatabase,
  teardownDatabase,
  clearDatabase,
  addProductsToDataBase,
} from './test-setup';
import { Product } from 'src/products/entities/product.entity';
import { Customer } from 'src/orders/entities/customer.entity';
import { OrderItem } from '../../src/orders/entities/orderItem.entity';
import { Order } from '../../src/orders/entities/order.entity';

import { Ecommerce } from 'ckh-typings';

const getItemsForOrder = async (
  app: INestApplication,
  noOfItems: number,
): Promise<null | OrderItem[]> => {
  const orderItems = await request(app.getHttpServer()).get('/products');

  const endIndex = Math.min(noOfItems, orderItems.body.length);

  if (!orderItems || orderItems.body.length < noOfItems) {
    return null;
  }

  if (noOfItems === 0) {
    return orderItems.body;
  }

  const itemsForOrder: Product[] = orderItems.body.slice(0, endIndex);
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
): Promise<void> => {
  try {
    const order = await request(app.getHttpServer())
      .post('/orders')
      .send({ orderItems, customer, orderCurrency, orderNotes });

    if (!order.body) {
      throw new Error('Failed to created order');
    }
  } catch (error) {
    console.log(error.message);
  }
};

describe('IntegrationsTest for orders module', () => {
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
    const orderItems1 = await getItemsForOrder(app, 1);
    const orderItems2 = await getItemsForOrder(app, 2);

    try {
      await addOrdersToSystem(
        app,
        orderItems1,
        FakeCustomer,
        Ecommerce.CurrencyType.DKK,
        null,
      );
      await addOrdersToSystem(
        app,
        orderItems2,
        FakeCustomer,
        Ecommerce.CurrencyType.DKK,
        null,
      );
    } catch (error) {
      console.log(error);
      fail('No orders where created');
    }
  });

  afterAll(async () => {
    await teardownDatabase(app);
  });
  test('Get all Orders from the /orders endpoint, GET test', async () => {
    const orders = await request(app.getHttpServer()).get('/orders');
    //* Since we have two orders, this must be 2
    expect(orders.body.length).toBe(2);
  });
  test('The system can return only orders with a relevant status - /Orders?status=status returns orders, GET test', async () => {
    expect.assertions(1);

    await request(app.getHttpServer())
      .get(`/orders?status=${Ecommerce.OrderStatus.SHIPPED}`)
      .expect(404);

    const orders = await request(app.getHttpServer())
      .get(`/orders?status=${Ecommerce.OrderStatus.RECEIVED}`)
      .expect(200);

    expect(orders.body.length).toBe(2);
  });
  test('Negative test - OrderStatus cannot be randomText or info', async () => {
    await request(app.getHttpServer())
      .get(`/orders?status=HellWorld`)
      .expect(400);

    await request(app.getHttpServer()).get(`/orders?status=123456`).expect(400);
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
      .expect(404);

    expect(orders.body.error).toBe('Not Found');
    expect(orders.body.message).toBe('There is no orders in the system');
  });

  test('Order status can be updated', async () => {
    expect.assertions(1);
    const orderInDatabase = await request(app.getHttpServer())
      .get('/orders')
      .expect(200);

    const ordersLength = orderInDatabase.body.length;

    const randomId = Math.floor(Math.random() * ordersLength);
    const orderId = orderInDatabase.body[randomId].id;

    const updatedOrder = await request(app.getHttpServer())
      .patch(`/orders/${orderId}?status=${Ecommerce.OrderStatus.CLOSED}`)
      .expect(200);

    expect(orderInDatabase.body[randomId].orderStatus).not.toBe(
      updatedOrder.body.orderStatus,
    );
  });
});
