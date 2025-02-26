import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../../src/orders/order.controller';
import { OrderService } from '../../../src/orders/order.service';
import {
  FakeCustomer,
  fakeCart,
  fakeOrderWithConfirmedStatus,
  fakeOrderWithReceivedStatus,
} from '../../testObjects';

import { NewOrderDto } from '../../../src/orders/dtos/new-order.dto';

import { Ecommerce } from 'ckh-typings';

describe('OrderController - create New - The test files have been spilt up in multiple files for better maintainability', () => {
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
  describe('Create New', () => {
    test('Controller can create a new order', async () => {
      const fakeNewOrder: NewOrderDto = {
        orderItems: fakeCart,
        customer: FakeCustomer,
        orderNotes: null,
        orderCurrency: Ecommerce.CurrencyType.DKK,
        paymentStatus: 'awaiting_capture',
        paymentId: 'fake_Id',
      };

      expect.assertions(3);
      const newOrder = await controller.createNewOrder(fakeNewOrder);
      expect(newOrder).toBeDefined();
      expect(newOrder.id).toBe(1);
      expect(newOrder.orderStatus).toBe(Ecommerce.OrderStatus.RECEIVED);
    });
  });
});
