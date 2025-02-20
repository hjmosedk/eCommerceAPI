import { fakeDiamondRingItem } from '../../testObjects';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../../src/orders/order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../../../src/orders/entities/order.entity';
import { OrderItem } from '../../../src/orders/entities/orderItem.entity';
import { ProductsService } from '../../../src/products/products.service';
import {
  fakeOrderWithReceivedStatus,
  fakeDiamondRingOrderItem,
  fakeNewOrder,
} from '../../testObjects';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentService } from '../../../src/payment/payment.service';
import { MessageService } from '../../../src/message/message.service';
import { createMockQueryBuilder } from '../../utils/mockQueryBuilder';
import { emailTemplateTypes } from '../../../src/message/entities/templates.enum';

describe('OrderService - Create One - The test files have been spilt up in multiple files for better maintainability', () => {
  let orderService: OrderService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let productsService: ProductsService;
  let messageService: MessageService;
  let dataSource: DataSource;
  let queryRunner;

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
    productsService = module.get<ProductsService>(ProductsService);
    messageService = module.get<MessageService>(MessageService);
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();

    jest
      .spyOn(orderRepository, 'create')
      .mockImplementation((order) => order as Order);
    jest
      .spyOn(orderItemRepository, 'create')
      .mockImplementation((orderItem) => orderItem as OrderItem);
  });

  describe('OrdersModule test - Create Orders', () => {
    delete fakeNewOrder.updateLastChange;
    test('Order Created correctly when called, and email notification send', async () => {
      const newCreatedOrder = { ...fakeNewOrder };
      const fakeOrderItem = { ...fakeDiamondRingOrderItem };
      const fakeOrder = {
        ...fakeOrderWithReceivedStatus,
        id: 1,
        updateLastChange: () => {},
      };
      fakeOrder.orderItems = [fakeOrderItem];
      const product = structuredClone(fakeDiamondRingItem);

      jest.spyOn(orderRepository, 'save').mockResolvedValue(fakeOrder);
      jest.spyOn(orderItemRepository, 'save').mockResolvedValue(fakeOrderItem);
      jest.spyOn(productsService, 'getOne').mockResolvedValue(product);
      jest
        .spyOn(queryRunner, 'commitTransaction')
        .mockResolvedValue(newCreatedOrder);
      jest
        .spyOn(queryRunner, 'rollbackTransaction')
        .mockResolvedValue(undefined);
      jest.spyOn(queryRunner, 'release').mockResolvedValue(undefined);
      jest.spyOn(messageService, 'sendMail').mockResolvedValue(undefined);

      jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue(
        createMockQueryBuilder({
          getOne: newCreatedOrder,
        }) as any,
      );

      const result = await orderService.createOne(newCreatedOrder);

      expect(result).toEqual(newCreatedOrder);
      expect(messageService.sendMail).toHaveBeenCalledWith(
        fakeNewOrder.customer.personalInformation.email,
        emailTemplateTypes.newOrder,
        expect.objectContaining({
          firstName: fakeNewOrder.customer.personalInformation.firstName,
          lastName: fakeNewOrder.customer.personalInformation.lastName,
          orderNumber: fakeOrder.id.toString(),
        }),
      );
    }),
      test('An error, BadRequestException is thrown if items, customer or paymentStatus is missing', async () => {
        const orderWithNoItems = { ...fakeNewOrder };
        await expect(orderService.createOne(orderWithNoItems)).rejects.toThrow(
          NotFoundException,
        );
        const orderWithNoCustomer = { ...fakeNewOrder };
        const fakeOrderItem = { ...fakeDiamondRingOrderItem };
        delete orderWithNoCustomer.customer;
        orderWithNoCustomer.orderItems = [fakeOrderItem];
        await expect(
          orderService.createOne(orderWithNoCustomer),
        ).rejects.toThrow(BadRequestException);
        const orderWithNoPaymentStatus = fakeNewOrder;
        orderWithNoPaymentStatus.orderItems = [fakeOrderItem];
        orderWithNoPaymentStatus.paymentStatus = undefined;
        await expect(
          orderService.createOne(orderWithNoPaymentStatus),
        ).rejects.toThrow(BadRequestException);
      }),
      test('transactions must be rolled back and a NotFoundException thrown is product is not in store', async () => {
        delete fakeNewOrder.updateLastChange;

        const newFakeOrder = structuredClone(fakeNewOrder);
        newFakeOrder.updateLastChange = () => {};
        fakeNewOrder.updateLastChange = () => {};
        newFakeOrder.paymentStatus = 'awaiting_collection';

        newFakeOrder.orderItems = [fakeDiamondRingOrderItem];

        jest.spyOn(productsService, 'getOne').mockResolvedValue(null);
        jest
          .spyOn(queryRunner, 'rollbackTransaction')
          .mockResolvedValue(undefined);

        await expect(orderService.createOne(newFakeOrder)).rejects.toThrow(
          NotFoundException,
        );
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      });
    test('If sales item, and/ or quantity is missing an error is thrown ', async () => {
      delete fakeNewOrder.updateLastChange;

      const newFakeOrder = structuredClone(fakeNewOrder);
      let newFakeDiamondRingOrderItem = structuredClone(
        fakeDiamondRingOrderItem,
      );
      newFakeDiamondRingOrderItem.salesQuantity = 0;

      newFakeOrder.updateLastChange = () => {};
      fakeNewOrder.updateLastChange = () => {};
      newFakeOrder.paymentStatus = 'awaiting_collection';

      newFakeOrder.orderItems = [newFakeDiamondRingOrderItem];

      jest
        .spyOn(queryRunner, 'rollbackTransaction')
        .mockResolvedValue(undefined);

      await expect(orderService.createOne(newFakeOrder)).rejects.toThrow(
        BadRequestException,
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();

      newFakeDiamondRingOrderItem.salesQuantity = 1;
      newFakeDiamondRingOrderItem.price = 0;

      await expect(orderService.createOne(newFakeOrder)).rejects.toThrow(
        BadRequestException,
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
