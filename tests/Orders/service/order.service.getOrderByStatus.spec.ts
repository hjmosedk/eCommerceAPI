import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../../src/orders/order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../../../src/orders/entities/order.entity';
import { OrderItem } from '../../../src/orders/entities/orderItem.entity';
import { ProductsService } from '../../../src/products/products.service';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Ecommerce } from 'ckh-typings';
import { PaymentService } from '../../../src/payment/payment.service';
import { MessageService } from '../../../src/message/message.service';
import { createMockQueryBuilder } from '../../utils/mockQueryBuilder';
import { createDto } from '../../utils/createDto';

describe('OrderService - Get Order By Status - The test files have been spilt up in multiple files for better maintainability', () => {
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

  describe('OrdersModule test - Get Order by Status', () => {
    test('Invalid page or limit will throw an error', async () => {
      expect.assertions(2);
      await expect(orderService.getAll(15, NaN)).rejects.toThrow(
        BadRequestException,
      );
      await expect(orderService.getAll(NaN, 5)).rejects.toThrow(
        BadRequestException,
      );
    }),
      test('Invalid status must throw BadRequestException', async () => {
        await expect(
          orderService.getOrderByStatus('Invalid' as any, 1, 25),
        ).rejects.toThrow(
          new BadRequestException('Status it not a valid value').message,
        );
      }),
      test('Should return orders by status', async () => {
        const orders = [{ id: 1 } as Order];
        const totalCount = 1;
        jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue(
          createMockQueryBuilder({
            getManyAndCount: [orders, totalCount],
          }) as any,
        );

        const orderDtos = createDto(orders);

        const result = await orderService.getOrderByStatus(
          Ecommerce.OrderStatus.CONFIRMED,
          1,
          25,
        );
        expect(result).toEqual([orderDtos, totalCount]);
      }),
      test('Should throw NotFoundException if no orders are found', async () => {
        jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue(
          createMockQueryBuilder({
            getManyAndCount: [[], 0],
          }) as any,
        );

        await expect(
          orderService.getOrderByStatus(Ecommerce.OrderStatus.CONFIRMED, 1, 10),
        ).rejects.toThrow(NotFoundException);
      });
  });
});
