import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../../src/orders/order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../../../src/orders/entities/order.entity';
import { OrderItem } from '../../../src/orders/entities/orderItem.entity';
import { ProductsService } from '../../../src/products/products.service';
import { PaymentService } from '../../../src/payment/payment.service';
import { MessageService } from '../../../src/message/message.service';

describe('OrderService - General Things - The test files have been spilt up in multiple files for better maintainability', () => {
  let orderService: OrderService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let productsService: ProductsService;
  let paymentService: PaymentService;
  let messageService: MessageService;
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
    productsService = module.get<ProductsService>(ProductsService);
    paymentService = module.get<PaymentService>(PaymentService);
    messageService = module.get<MessageService>(MessageService);
    dataSource = module.get<DataSource>(DataSource);

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
});
