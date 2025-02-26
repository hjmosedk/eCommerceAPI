import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../../src/orders/order.controller';
import { OrderService } from '../../../src/orders/order.service';
import {
  fakeOrderWithConfirmedStatus,
  fakeOrderWithReceivedStatus,
} from '../../testObjects';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { NewOrderDto } from '../../../src/orders/dtos/new-order.dto';

import { Ecommerce } from 'ckh-typings';

describe('OrderController - Update Order Status - The test files have been spilt up in multiple files for better maintainability', () => {
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
