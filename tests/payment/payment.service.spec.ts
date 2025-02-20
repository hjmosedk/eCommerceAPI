import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../../src/payment/payment.service';
import { StripeService } from '../../src/payment/stripe.service';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Ecommerce } from 'ckh-typings';
import { PaymentStatusException } from '../../src/globalFunctions/exceptionsHandler/custom.exceptions';

const mockPaymentIntentCreate = jest.fn();

describe('PaymentService', () => {
  let service: PaymentService;
  let stripService: StripeService;
  let configServiceMock: Partial<ConfigService>;

  beforeEach(async () => {
    configServiceMock = {
      get: jest.fn().mockReturnValue('fake-stripe-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        StripeService,
        { provide: ConfigService, useValue: configServiceMock },
        { provide: 'STRIPE_KEY', useValue: 'fake-stripe-key' },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    stripService = module.get<StripeService>(StripeService);
  });

  describe('createPaymentIntent', () => {
    test('should create a payment intent', async () => {
      const orderPrice = 1000;
      const orderCurrency = Ecommerce.CurrencyType.DKK;

      mockPaymentIntentCreate.mockReturnValueOnce({
        id: 'pi_fake',
        status: 'requires_capture',
      });

      const paymentIntentSpy = jest.spyOn(service, 'createPaymentIntent');

      const paymentIntent = await service.createPaymentIntent(
        orderPrice,
        orderCurrency,
      );

      expect(paymentIntentSpy).toHaveBeenCalledWith(orderPrice, orderCurrency);
      expect(paymentIntent).toEqual({
        id: 'pi_fake',
        status: 'requires_capture',
      });
    });
    test('should throw an error is payment intent cannot be created', async () => {
      const orderPrice = 1000;
      const orderCurrency = Ecommerce.CurrencyType.DKK;
      service.stripe.paymentIntents.create = jest
        .fn()
        .mockRejectedValue({ error: { message: 'This is a test' } });

      expect(
        service.createPaymentIntent(orderPrice, orderCurrency),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('capturePayment', () => {
    test('should capture a payment', async () => {
      const paymentIntendId = 'pi_fake';
      const metadata = { orderId: '12345' };

      const capturePaymentSpy = jest.spyOn(service, 'capturePayment');

      await service.capturePayment(paymentIntendId, metadata);

      expect(capturePaymentSpy).toHaveBeenCalledWith(paymentIntendId, metadata);
    });

    test('should throw an error if payment intent does not exist', async () => {
      const paymentIntendId = 'pi_nonexistent';

      service.stripe.paymentIntents.retrieve = jest
        .fn()
        .mockResolvedValueOnce(null);

      await expect(service.capturePayment(paymentIntendId, {})).rejects.toThrow(
        BadRequestException,
      );
    });
    test('should throw an error if payment status is not succeeded', async () => {
      service.stripe.paymentIntents.capture = jest
        .fn()
        .mockResolvedValueOnce({ status: 'failed' });

      await expect(service.capturePayment('pi_fake', {})).rejects.toThrow(
        PaymentStatusException,
      );
    });

    test('should throw an error if payment capture fails', async () => {
      service.stripe.paymentIntents.capture = jest
        .fn()
        .mockResolvedValueOnce(null);

      const paymentIntendId = 'pi_fake';

      await expect(service.capturePayment(paymentIntendId, {})).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
