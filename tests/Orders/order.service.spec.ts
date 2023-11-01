import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../src/orders/order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../src/orders/entities/order.entity';
import { OrderItem } from '../../src/orders/entities/orderItem.entity';
import { ProductsService } from '../../src/products/products.service';
//import { ProductsModule } from '../../src/products/products.module';
import { Product } from '../../src/products/entities/product.entity';
//import { OrdersModule } from '../../src/orders/orders.module';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Order), useClass: Repository },
        { provide: getRepositoryToken(OrderItem), useClass: Repository },
        { provide: getRepositoryToken(Product), useClass: Repository },
        OrderService,
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get(getRepositoryToken(Order));
    orderItemRepository = module.get(getRepositoryToken(OrderItem));
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
    test('All orders can be found in the system', () => {});
  });
});
