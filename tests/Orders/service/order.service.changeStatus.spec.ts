import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../../src/orders/order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../../../src/orders/entities/order.entity';
import { OrderItem } from '../../../src/orders/entities/orderItem.entity';
import { ProductsService } from '../../../src/products/products.service';
import { fakeOrderWithReceivedStatus } from '../../testObjects';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Ecommerce } from 'ckh-typings';
import { PaymentService } from '../../../src/payment/payment.service';
import { MessageService } from '../../../src/message/message.service';

describe('OrderService - Change Status - The test files have been spilt up in multiple files for better maintainability', () => {
  let orderService: OrderService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let dataSource: DataSource;
  let queryBuilderMock;

  beforeEach(async () => {
    jest.resetAllMocks();

    queryBuilderMock = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      getOne: jest.fn().mockResolvedValue(null),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            ...queryBuilderMock,
            save: jest.fn(),
            create: jest.fn().mockImplementation((order) => order as Order),
            findOne: jest.fn().mockReturnThis(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null), // Adjust as needed for the test
              getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            }),
          },
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: {
            save: jest.fn(),
            create: jest
              .fn()
              .mockImplementation((orderItem) => orderItem as OrderItem),
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn().mockResolvedValue(undefined),
              release: jest.fn().mockResolvedValue(undefined),
              isTransactionActive: true,
            }),
          },
        },
        {
          provide: ProductsService,
          useValue: { getOne: jest.fn() },
        },
        { provide: PaymentService, useValue: { capturePayment: jest.fn() } },
        { provide: MessageService, useValue: { sendMail: jest.fn() } },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn().mockResolvedValue(undefined),
              release: jest.fn().mockResolvedValue(undefined),
              isTransactionActive: true,
            }),
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get(getRepositoryToken(Order));
    orderItemRepository = module.get(getRepositoryToken(OrderItem));
    dataSource = module.get<DataSource>(DataSource);

    jest
      .spyOn(orderRepository, 'create')
      .mockImplementation((order) => order as Order);
    jest
      .spyOn(orderItemRepository, 'create')
      .mockImplementation((orderItem) => orderItem as OrderItem);
  });

  describe('Change status of orders', () => {
    test('Error is thrown is ID is missing from the request', async () => {
      expect.assertions(2);

      try {
        await orderService.changeStatus(null, Ecommerce.OrderStatus.PACKED);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Id or status missing');
      }
    });
    test('Error is thrown if status is missing', async () => {
      expect.assertions(2);

      try {
        await orderService.changeStatus(1, null);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Id or status missing');
      }
    });
    test('If invalid status type is used, and error is thrown', async () => {
      expect.assertions(2);

      try {
        await orderService.changeStatus(
          1,
          'Hello World!!!!' as Ecommerce.OrderStatus,
        );
        expect(true).toBe(false); // Type casting used, to ensure TS does not give error at compline time.
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('New Status is not accepted');
      }
    });
    test('OrderStatus is correctly updated, with shipped', async () => {
      const testOrderToBeUpdated = {
        ...fakeOrderWithReceivedStatus,
        updateLastChange: () => {},
      };

      expect.assertions(4);

      jest
        .spyOn(orderService, 'getOne')
        .mockResolvedValue(testOrderToBeUpdated);

      jest.spyOn(orderRepository, 'save').mockResolvedValue({
        ...testOrderToBeUpdated,
        orderStatus: Ecommerce.OrderStatus.SHIPPED,
      });

      jest
        .spyOn(orderRepository, 'findOne')
        .mockResolvedValue(testOrderToBeUpdated);

      const newOrder = await orderService.getOne(testOrderToBeUpdated.id);
      expect(newOrder.id).toBe(1);
      expect(newOrder.orderStatus).toBe(Ecommerce.OrderStatus.RECEIVED);

      const updatedOrder = await orderService.changeStatus(
        1,
        Ecommerce.OrderStatus.SHIPPED,
      );

      expect(updatedOrder.id).toBe(testOrderToBeUpdated.id);
      expect(updatedOrder.orderStatus).toBe(Ecommerce.OrderStatus.SHIPPED);
    });
    test('OrderStatus is correctly updated, with confirmed', async () => {
      const testOrderToBeUpdated = {
        ...fakeOrderWithReceivedStatus,
        updateLastChange: () => {},
      };

      expect.assertions(4);

      jest
        .spyOn(orderService, 'getOne')
        .mockResolvedValue(testOrderToBeUpdated);

      jest.spyOn(orderRepository, 'save').mockResolvedValue({
        ...testOrderToBeUpdated,
        orderStatus: Ecommerce.OrderStatus.CONFIRMED,
      });

      jest
        .spyOn(orderRepository, 'findOne')
        .mockResolvedValue(testOrderToBeUpdated);

      const newOrder = await orderService.getOne(testOrderToBeUpdated.id);
      expect(newOrder.id).toBe(1);
      expect(newOrder.orderStatus).toBe(Ecommerce.OrderStatus.RECEIVED);

      const updatedOrder = await orderService.changeStatus(
        1,
        Ecommerce.OrderStatus.CONFIRMED,
      );

      expect(updatedOrder.id).toBe(testOrderToBeUpdated.id);
      expect(updatedOrder.orderStatus).toBe(Ecommerce.OrderStatus.CONFIRMED);
    });
    test('Error is thrown is collect payment fails', async () => {
      jest.spyOn(orderService, 'confirmOrder').mockImplementation(() => {
        throw new InternalServerErrorException(
          'The order cannot be confirmed! - Please try again',
        );
      });

      await expect(
        orderService.changeStatus(1, Ecommerce.OrderStatus.CONFIRMED),
      ).rejects.toThrow(
        new InternalServerErrorException(
          'The order cannot be confirmed! - Please try again',
        ),
      );
    });
  });
});
