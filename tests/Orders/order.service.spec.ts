import { fakeDiamondRingItem } from './../testObjects';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../src/orders/order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../../src/orders/entities/order.entity';
import { OrderItem } from '../../src/orders/entities/orderItem.entity';
import { ProductsService } from '../../src/products/products.service';
import {
  fakeOrderWithReceivedStatus,
  fakeDiamondRingOrderItem,
  fakeNewOrder,
} from '../testObjects';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Ecommerce } from 'ckh-typings';
import { PaymentService } from '../../src/payment/payment.service';
import { MessageService } from '../../src/message/message.service';
import { createMockQueryBuilder } from '../utils/mockQueryBuilder';
import { createDto } from '../utils/createDto';
import { emailTemplateTypes } from '../../src/message/entities/templates.enum';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let productsService: ProductsService;
  let paymentService: PaymentService;
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
    paymentService = module.get<PaymentService>(PaymentService);
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

  describe('Initial test, is everything working', () => {
    test('orderService should be defined', () => {
      expect(orderService).toBeDefined();
    });
    test('OrderRepository should be defined', () => {
      expect(orderRepository).toBeDefined();
    });
    test('OrderItemRepository should be defined', () => {
      expect(orderItemRepository).toBeDefined();
    });
    test('ProductService should be defined', () => {
      expect(productsService).toBeDefined();
    });
    test('PaymentService should be defined', () => {
      expect(paymentService).toBeDefined();
    });
    test('MessageService should be defined', () => {
      expect(messageService).toBeDefined();
    });
    test('DataSource should be defined', () => {
      expect(dataSource).toBeDefined();
    });
  });

  describe('OrdersModule test - Get Orders', () => {
    test('Invalid page or limit will throw an error', async () => {
      expect.assertions(1);
      await expect(orderService.getAll(NaN, NaN)).rejects.toThrow(
        BadRequestException,
      );
    }),
      test('A list of orders and total count is returned', async () => {
        const orders = [{ id: 1 } as Order];
        const totalCount = 1;

        jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue(
          createMockQueryBuilder({
            getOne: null,
            getManyAndCount: [orders, totalCount],
          }) as any,
        );

        const orderDtos = createDto(orders);

        const result = await orderService.getAll(1, 25);
        expect(result).toEqual([orderDtos, totalCount]);
      }),
      test('No order is in the system, so NotFoundException should be thrown', async () => {
        jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue(
          createMockQueryBuilder({
            getManyAndCount: [[], 0],
          }) as any,
        );

        await expect(orderService.getAll(1, 25)).rejects.toThrow(
          NotFoundException,
        );
      });
  });

  describe('OrdersModule test - Get Order by Status', () => {
    test('Invalid status must throw BadRequestException', async () => {
      await expect(
        orderService.getOrderByStatus('Invalid' as any, 1, 25),
      ).rejects.toThrow(BadRequestException);
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
      test('Should throw NotFoundException is no orders are found', async () => {
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

  describe('OrderModule test - Get Order by ID', () => {
    test('No ID include result in an error', async () => {
      await expect(orderService.getOne(null)).rejects.toThrow(
        BadRequestException,
      );
    }),
      test('A NotFoundException is thrown is no order is found', async () => {
        jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue(
          createMockQueryBuilder({
            getOne: null,
          }) as any,
        );

        await expect(orderService.getOne(999)).rejects.toThrow(
          NotFoundException,
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
  });

  describe('OrderModule test - Get Full Orders', () => {
    test('No ID include result in an error', async () => {
      await expect(orderService.getOne(null)).rejects.toThrow(
        BadRequestException,
      );
    }),
      test('A NotFoundException is thrown is no order is found', async () => {
        jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue(
          createMockQueryBuilder({
            getOne: null,
          }) as any,
        );

        await expect(orderService.getOne(999)).rejects.toThrow(
          NotFoundException,
        );
      }),
      test('Order is correctly found, and have full information', async () => {
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

        const result = await orderService.getOneWithPaymentDetails(1);
        expect(result).toBeDefined();
        expect(result.paymentId).toBeDefined();
      });
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
        console.log(newFakeOrder);

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
    test('OrderStatus is correctly updated', async () => {
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
  });
});
