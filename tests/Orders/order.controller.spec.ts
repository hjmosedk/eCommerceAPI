import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../src/orders/order.controller';
import { OrderService } from '../../src/orders/order.service';
import {
  FakeCustomer,
  fakeCart,
  fakeOrderWithConfirmedStatus,
  fakeOrderWithReceivedStatus,
} from '../testObjects';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NewOrderDto } from '../../src/orders/dtos/new-order.dto';

import { Ecommerce } from 'ckh-typings';

describe('OrderController', () => {
  let controller: OrderController;
  let fakeOrderService: Partial<OrderService>;
  const OrderArray = [
    fakeOrderWithReceivedStatus,
    fakeOrderWithConfirmedStatus,
  ];
  const newOrderStatus = {
    ...fakeOrderWithReceivedStatus,
    orderStatus: Ecommerce.OrderStatus.PACKED,
    updateLastChange: () => {},
  };

  beforeEach(async () => {
    fakeOrderService = {
      getAll: (page, limit) => {
        return Promise.resolve([OrderArray, OrderArray.length]);
      },
      getOrderByStatus(status) {
        const filteredOrder = OrderArray.filter(
          (order) => order.orderStatus === status,
        );
        return Promise.resolve([filteredOrder, filteredOrder.length]);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      createOne: (_newOrder: NewOrderDto) => {
        return Promise.resolve(fakeOrderWithReceivedStatus);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getOne: (_id: number) => {
        return Promise.resolve(fakeOrderWithReceivedStatus);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      changeStatus: (_id: number, _newStatus: Ecommerce.OrderStatus) => {
        return Promise.resolve(newOrderStatus);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: OrderService, useValue: fakeOrderService }],
      controllers: [OrderController],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  describe('Initial test - Is very thing working?', () => {
    test('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('GET, does all get functions work?', () => {
    test('There is no orders in the system, an error is thrown', async () => {
      fakeOrderService.getAll = jest.fn().mockImplementation(() => {
        throw new NotFoundException('There is no orders in the system');
      });

      expect.assertions(2);

      try {
        await controller.getAllOrders(1, 25);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('There is no orders in the system');
      }
    });
    test('All orders are returned when called without any params', async () => {
      const ordersList = await controller.getAllOrders(1, 25);

      expect.assertions(2);
      expect(ordersList['orders'].length).toBe(2);
      expect(ordersList.orders).toContain(fakeOrderWithReceivedStatus);
    });
    test('Incorrect status result in an error', async () => {
      fakeOrderService.getOrderByStatus = jest.fn().mockImplementation(() => {
        throw new BadRequestException('Status is not correct');
      });
      expect.assertions(2);

      try {
        await controller.getAll('Hello World' as any, 1, 25);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Status is not correct');
      }
    });
    test('Sort on status works as expected', async () => {
      const filteredOrder = await controller.getAll(
        Ecommerce.OrderStatus.CONFIRMED,
        1,
        25,
      );
      expect.assertions(2);
      expect(filteredOrder['orders'].length).toBe(1);
      expect(filteredOrder.orders[0].orderStatus).toBe(
        Ecommerce.OrderStatus.CONFIRMED,
      );
    });
    test('Get order by ID works as expected', async () => {
      const orders = await controller.getAllOrders(1, 25);
      const orderId = orders['orders'][0].id;
      const order = await controller.findOne(orderId.toString());

      expect.assertions(3);

      expect(order).toBeDefined();
      expect(order.id).toBe(orderId);
      expect(order.orderTotalPrice).toBe(orders['orders'][0].orderTotalPrice);
    });
  });
  describe('POST, does the functions works as expected?', () => {
    test('Controller can create a new order', async () => {
      const fakeNewOrder: NewOrderDto = {
        orderItems: fakeCart,
        customer: FakeCustomer,
        orderNotes: null,
        orderCurrency: Ecommerce.CurrencyType.DKK,
        paymentStatus: 'awaiting_capture',
        paymentId: 'fake_Id',
        paymentMethodId: 'fakeId',
      };

      expect.assertions(3);
      const newOrder = await controller.createNewOrder(fakeNewOrder);
      expect(newOrder).toBeDefined();
      expect(newOrder.id).toBe(1);
      expect(newOrder.orderStatus).toBe(Ecommerce.OrderStatus.RECEIVED);
    });
  });
  describe('GET/:ID works as expected', () => {
    test('if id is missing an error is thrown', async () => {
      expect.assertions(2);

      try {
        await controller.findOne(null);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Id is missing');
      }
    });
    test('If no order is returned and error is thrown', async () => {
      fakeOrderService.getOne = () => {
        return Promise.resolve(null);
      };

      expect.assertions(2);

      try {
        await controller.findOne('1');
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Order not found, or does not exists');
      }
    });
  });
  describe('PATCH/:ID works as expected', () => {
    test('If id is missing, an error is thrown', async () => {
      expect.assertions(2);

      try {
        await controller.updateStatus(null, Ecommerce.OrderStatus.PACKED);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Id or new status is missing from the request',
        );
      }
    });
    test('If status is missing, an error is thrown', async () => {
      expect.assertions(2);

      try {
        await controller.updateStatus('1', null);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Id or new status is missing from the request',
        );
      }
    });
    test('For some reason the order is not updated and an error is thrown', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fakeOrderService.changeStatus = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _id: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _status: Ecommerce.OrderStatus,
      ) => {
        return Promise.resolve(null);
      };

      expect.assertions(2);
      try {
        await controller.updateStatus('1', Ecommerce.OrderStatus.PACKED);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Unknown error!');
      }
    });
    test('order updated correct', async () => {
      const updatedOrder = await controller.updateStatus(
        '1',
        Ecommerce.OrderStatus.PACKED,
      );
      expect(updatedOrder).toBeDefined();
      expect(updatedOrder.id).toBe(1);
      expect(updatedOrder.orderStatus).toBe(Ecommerce.OrderStatus.PACKED);
    });
  });
});
