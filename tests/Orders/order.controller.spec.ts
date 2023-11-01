import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../src/orders/order.controller';
import { OrderService } from '../../src/orders/order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let fakeOrderService: Partial<OrderService>;

  beforeEach(async () => {
    fakeOrderService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: OrderService, useValue: fakeOrderService }],
      controllers: [OrderController],
    }).compile();

    console.log(module.get(OrderController));

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
