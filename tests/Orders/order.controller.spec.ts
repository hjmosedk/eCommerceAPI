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
import { OrderStatus } from '../../src/orders/entities/order.entity';
import { NewOrderDto } from '../../src/orders/dtos/new-order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let fakeOrderService: Partial<OrderService>;
  const OrderArray = [
    fakeOrderWithReceivedStatus,
    fakeOrderWithConfirmedStatus,
  ];
  const newOrderStatus = {
    ...fakeOrderWithReceivedStatus,
    orderStatus: OrderStatus.PACKED,
    updateLastChange: () => {},
  };

  beforeEach(async () => {
    fakeOrderService = {
      getAll: () => {
        return Promise.resolve(OrderArray);
      },
      getOrderByStatus(status) {
        return Promise.resolve(
          OrderArray.filter((order) => order.orderStatus === status),
        );
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
      changeStatus: (_id: number, _newStatus: OrderStatus) => {
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
      fakeOrderService.getAll = () => {
        return Promise.resolve([]);
      };

      expect.assertions(2);

      try {
        await controller.getAll();
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('There is no orders in the system');
      }
    });
    test('All orders are returned when called without any params', async () => {
      const ordersList = await controller.getAll();

      expect.assertions(2);
      expect(ordersList.length).toBe(2);
      expect(ordersList).toContain(fakeOrderWithReceivedStatus);
    });
    test('Incorrect status result in an error', async () => {
      expect.assertions(2);

      try {
        await controller.getAll('Hello World' as OrderStatus);
        expect(false).toBe(true); // Type casting is used, to ensure the typescript compline check does
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Status is not correct');
      }
    });
    test('Sort on status works as expected', async () => {
      const filteredOrder = await controller.getAll(OrderStatus.CONFIRMED);
      expect.assertions(2);
      expect(filteredOrder.length).toBe(1);
      expect(filteredOrder[0].orderStatus).toBe(OrderStatus.CONFIRMED);
    });
  });
  describe('POST, does the functions works as expected?', () => {
    test('Controller can create a new order', async () => {
      const fakeNewOrder: NewOrderDto = {
        orderItems: fakeCart,
        customer: FakeCustomer,
        orderNotes: null,
      };

      expect.assertions(3);
      const newOrder = await controller.createNewOrder(fakeNewOrder);
      expect(newOrder).toBeDefined();
      expect(newOrder.id).toBe(1);
      expect(newOrder.orderStatus).toBe(OrderStatus.RECEIVED);
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
        await controller.updateStatus(null, OrderStatus.PACKED);
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
      fakeOrderService.changeStatus = (_id: number, _status: OrderStatus) => {
        return Promise.resolve(null);
      };

      expect.assertions(2);
      try {
        await controller.updateStatus('1', OrderStatus.PACKED);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Unknown error!');
      }
    });
    test('order updated correct', async () => {
      const updatedOrder = await controller.updateStatus(
        '1',
        OrderStatus.PACKED,
      );
      expect(updatedOrder).toBeDefined();
      expect(updatedOrder.id).toBe(1);
      expect(updatedOrder.orderStatus).toBe(OrderStatus.PACKED);
    });
  });
});
