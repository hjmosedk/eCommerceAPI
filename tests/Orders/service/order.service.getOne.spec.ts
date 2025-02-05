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

describe('OrderService - Get One - The test files have been spilt up in multiple files for better maintainability', () => {
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

  describe('OrderModule test - Get One', () => {
    test('No ID include result in an error', async () => {
      await expect(orderService.getOne(null)).rejects.toThrow(
        new BadRequestException('Id is missing').message,
      );
    }),
      test('Order is correctly found', async () => {
        const order = {
          id: 1,
          orderStatus: Ecommerce.OrderStatus.CONFIRMED,
          paymentId: 'FakeId',
        } as Order;
        jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue(
          createMockQueryBuilder({
            getOne: order,
          }) as any,
        );

        const result = await orderService.getOne(1);
        const expectedDto = orderService.toOrderDto(order);
        expect(result).toEqual(expectedDto);
        expect(result).toMatchObject({
          id: expect.any(Number),
          orderStatus: expect.any(String),
        });

        expect('paymentId' in result).toBe(true);
      });
    test('A NotFoundException is thrown is no order is found', async () => {
      jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue(
        createMockQueryBuilder({
          getOne: null,
        }) as any,
      );

      await expect(orderService.getOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
