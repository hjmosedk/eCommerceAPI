import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../../src/payment/payment.controller';
import { PaymentService } from '../../src/payment/payment.service';
import PaymentIntent from 'stripe';
import { Ecommerce } from 'ckh-typings';
import { fakeCheecburgerOrderItem } from '../testObjects';

describe('OrderController', () => {
  let controller: PaymentController;
  let fakePaymentService: Partial<PaymentService>;

  beforeEach(async () => {
    fakePaymentService = {
      createPaymentIntent: (amount, currency) => {
        return Promise.resolve({} as any);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PaymentService, useValue: fakePaymentService }],
      controllers: [PaymentController],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  describe('Initial test - Is everything working?', () => {
    test('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('GET, does all get functions work?', () => {
    test('A payment Intent is returned as expected', async () => {
      const paymentSpy = jest.spyOn(fakePaymentService, 'createPaymentIntent');

      expect.assertions(1);

      await controller.paymentIntent({
        orderCurrency: Ecommerce.CurrencyType.DKK,
        orderItems: [fakeCheecburgerOrderItem],
      });

      expect(paymentSpy).toHaveBeenCalledWith(4900, Ecommerce.CurrencyType.DKK);
    });
  });
});
