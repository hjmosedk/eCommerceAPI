import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../../src/orders/order.controller';
import { OrderService } from '../../../src/orders/order.service';
import {
  fakeOrderWithConfirmedStatus,
  fakeOrderWithReceivedStatus,
} from '../../testObjects';
import { BadRequestException } from '@nestjs/common';
import { NewOrderDto } from '../../../src/orders/dtos/new-order.dto';

import { Ecommerce } from 'ckh-typings';

describe('OrderController - Get All By Status - The test files have been spilt up in multiple files for better maintainability', () => {
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

  describe('GET All By Status', () => {
    test('Incorrect status result in an error', async () => {
      fakeOrderService.getOrderByStatus = jest.fn().mockImplementation(() => {
        throw new BadRequestException('Status is not correct');
      });
      expect.assertions(2);

      try {
        await controller.getAllByStatus('Hello World' as any, 1, 25);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Status is not correct');
      }
    });
    test('Sort on status works as expected', async () => {
      const filteredOrder = await controller.getAllByStatus(
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
  });
});
