import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../../src/orders/order.controller';
import { OrderService } from '../../../src/orders/order.service';
import {
  fakeOrderWithConfirmedStatus,
  fakeOrderWithReceivedStatus,
} from '../../testObjects';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NewOrderDto } from '../../../src/orders/dtos/new-order.dto';

import { Ecommerce } from 'ckh-typings';

describe('OrderController - Get By ID - The test files have been spilt up in multiple files for better maintainability', () => {
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

  describe('Get By ID', () => {
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
    test('An order with correct ID is returned', async () => {
      const order = await controller.findOne('1');

      expect.assertions(2);
      expect(order).toBeDefined();
      expect(order).toBe(fakeOrderWithReceivedStatus);
    });
  });
});
