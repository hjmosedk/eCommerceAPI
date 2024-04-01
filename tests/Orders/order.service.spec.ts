import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../src/orders/order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../src/orders/entities/order.entity';
import { OrderItem } from '../../src/orders/entities/orderItem.entity';
import { ProductsService } from '../../src/products/products.service';
import {
  fakeOrderWithReceivedStatus,
  FakeOrderList,
  fakeDiamondRingItem,
  fakeDiamondRingOrderItem,
  fakeNewOrder,
} from '../testObjects';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ecommerce } from 'ckh-typings';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let productsService: ProductsService;

  const queryBuilderMock = {
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Order), useClass: Repository },
        { provide: getRepositoryToken(OrderItem), useClass: Repository },
        {
          provide: ProductsService,
          useValue: { getOne: jest.fn() },
        },
        OrderService,
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get(getRepositoryToken(Order));
    orderItemRepository = module.get(getRepositoryToken(OrderItem));
    productsService = module.get<ProductsService>(ProductsService);
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
  });

  describe('OrdersModule test - Get Orders', () => {
    test('No order is in the system, so null should be returned', async () => {
      queryBuilderMock.getMany = jest.fn().mockResolvedValue(null);

      const orderRepositorySpy = jest
        .spyOn(orderRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      const result = await orderService.getAll();

      expect.assertions(2);

      expect(result).toBe(null);
      expect(orderRepositorySpy).toHaveBeenCalled();
    }),
      test('A list of orders is returned from the service', async () => {
        queryBuilderMock.getMany = jest.fn().mockResolvedValue(FakeOrderList);

        const orderRepositorySpy = jest
          .spyOn(orderRepository, 'createQueryBuilder')
          .mockReturnValue(queryBuilderMock as any);

        const result = await orderService.getAll();

        expect.assertions(3);

        expect(result).toBe(FakeOrderList);
        expect(orderRepositorySpy).toHaveBeenCalled();
        expect(result.length).toBe(2);
      });
  });

  describe('OrdersModule test - Get Order by Status', () => {
    test('No orders with requested status is null', async () => {
      const queryBuilderMock = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      const orderRepositorySpy = jest
        .spyOn(orderRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      expect.assertions(3);

      try {
        await orderService.getOrderByStatus(ecommerce.OrderStatus.CLOSED);
        expect(true).toBe(false); //* If this code is reached, something is wrong and the test should fail
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No orders in system');
      }

      expect(orderRepositorySpy).toHaveBeenCalled();
    }),
      test('One out of two orders is returned based on status', async () => {
        const queryBuilderMock = {
          leftJoin: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue(
            FakeOrderList.filter((order) => {
              return order.orderStatus === ecommerce.OrderStatus.RECEIVED;
            }),
          ),
        };

        const orderRepositorySpy = jest
          .spyOn(orderRepository, 'createQueryBuilder')
          .mockReturnValue(queryBuilderMock as any);

        const result = await orderService.getOrderByStatus(
          ecommerce.OrderStatus.RECEIVED,
        );

        expect.assertions(3);

        expect(result.length).toBe(1);
        expect(result[0].orderStatus).toBe(ecommerce.OrderStatus.RECEIVED);
        expect(orderRepositorySpy).toHaveBeenCalled();
      });
  });

  describe('OrderModule test - Get Order by ID', () => {
    test('No ID include result in an error', async () => {
      expect.assertions(2);

      try {
        await orderService.getOne(0);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Id is missing');
      }
    }),
      test('No product with the ID correctly returns and error', async () => {
        queryBuilderMock.getOne = jest.fn().mockResolvedValue(null);

        const orderRepositorySpy = jest
          .spyOn(orderRepository, 'createQueryBuilder')
          .mockReturnValue(queryBuilderMock as any);

        expect.assertions(3);

        try {
          await orderService.getOne(3);
          expect(true).toBe(false);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe('No product found with the ID');
        }

        expect(orderRepositorySpy).toHaveBeenCalled();
      });
    test('One Product with ID is correctly Found', async () => {
      queryBuilderMock.getOne = jest
        .fn()
        .mockResolvedValue(fakeOrderWithReceivedStatus);

      const orderRepositorySpy = jest
        .spyOn(orderRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      const result = await orderService.getOne(fakeOrderWithReceivedStatus.id);

      expect.assertions(2);

      expect(result).toBe(fakeOrderWithReceivedStatus);
      expect(orderRepositorySpy).toHaveBeenCalled();
    });
  });

  describe('OrdersModule test - Create Orders', () => {
    test('Order Created correctly when called', async () => {
      queryBuilderMock.getMany = jest.fn().mockResolvedValue(FakeOrderList);

      const orderRepositorySpy = jest
        .spyOn(orderRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      const orderRepositoryCreateSpy = jest
        .spyOn(orderRepository, 'create')
        .mockReturnValue(fakeOrderWithReceivedStatus);

      const orderRepositorySaveSpy = jest
        .spyOn(orderRepository, 'save')
        .mockResolvedValue(fakeOrderWithReceivedStatus);

      jest
        .spyOn(orderRepository, 'find')
        .mockResolvedValue([fakeOrderWithReceivedStatus]);

      const mockedProductService = jest
        .spyOn(productsService, 'getOne')
        .mockResolvedValue(fakeDiamondRingItem);

      const orderItemRepositorySpy = jest
        .spyOn(orderItemRepository, 'save')
        .mockResolvedValue(fakeDiamondRingOrderItem);

      const newOrder = await orderService.createOne(fakeNewOrder);

      expect.assertions(6);

      expect(mockedProductService).toHaveBeenCalledWith(1);
      expect(orderItemRepositorySpy).toHaveBeenCalledTimes(2);
      expect(orderRepositoryCreateSpy).toHaveBeenCalled();
      expect(orderRepositorySaveSpy).toHaveBeenCalledWith(
        fakeOrderWithReceivedStatus,
      );

      expect(orderRepositorySpy).toHaveBeenCalled();

      expect(newOrder).toBeDefined();
    });
    test('Error is thrown if customer or cart is missing', async () => {
      expect.assertions(4);

      const wrongOrderWithNoCustomer = {
        ...fakeOrderWithReceivedStatus,
        customer: null,
      };

      const wrongOrderWithoutCart = {
        ...fakeOrderWithReceivedStatus,
        orderItems: null,
      };

      try {
        await orderService.createOne(wrongOrderWithNoCustomer);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Items or customer missing');
      }

      try {
        await orderService.createOne(wrongOrderWithoutCart);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Items or customer missing');
      }
    });
    test('An error is thrown if the product does not exist in store', async () => {
      jest //This is need to do the "create call"
        .spyOn(orderRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      const mockedProductService = jest
        .spyOn(productsService, 'getOne')
        .mockResolvedValue(null);

      jest // There is no reason to test the create function here, as it is being tested in the create order - This just need to execute to get the error on products
        .spyOn(orderRepository, 'create')
        .mockReturnValue(fakeOrderWithReceivedStatus);

      try {
        await orderService.createOne(fakeOrderWithReceivedStatus);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Product is not in store');
      }

      expect.assertions(3);

      expect(mockedProductService).toHaveBeenCalled();
    });
  });

  describe('Change status of orders', () => {
    test('Error is thrown is ID is missing from the request', async () => {
      expect.assertions(2);

      try {
        await orderService.changeStatus(null, ecommerce.OrderStatus.PACKED);
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
        //@ts-expect-error due testing invalid status type
        await orderService.changeStatus(1, 'Hello World!!!!');
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

      queryBuilderMock.getOne = jest
        .fn()
        .mockResolvedValue(testOrderToBeUpdated);

      jest
        .spyOn(orderRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      jest
        .spyOn(orderRepository, 'findOne')
        .mockResolvedValue(testOrderToBeUpdated);

      jest.spyOn(orderRepository, 'save').mockResolvedValue({
        ...testOrderToBeUpdated,
        orderStatus: ecommerce.OrderStatus.PACKED,
      });

      const newOrder = await orderService.getOne(testOrderToBeUpdated.id);
      expect(newOrder.id).toBe(1);
      expect(newOrder.orderStatus).toBe(ecommerce.OrderStatus.RECEIVED);

      const updatedOrder = await orderService.changeStatus(
        1,
        ecommerce.OrderStatus.PACKED,
      );

      expect(updatedOrder.id).toBe(testOrderToBeUpdated.id);
      expect(updatedOrder.orderStatus).toBe(ecommerce.OrderStatus.PACKED);
    });
  });
});
