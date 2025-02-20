import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../../src/orders/order.controller';
import { OrderService } from '../../../src/orders/order.service';
import {
  FakeCustomer,
  fakeCart,
  fakeOrderWithConfirmedStatus,
  fakeOrderWithReceivedStatus,
} from '../../testObjects';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NewOrderDto } from '../../../src/orders/dtos/new-order.dto';

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
});
