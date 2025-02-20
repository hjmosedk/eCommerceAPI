import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PaymentStatusException } from '../globalFunctions/exceptionsHandler/custom.exceptions';
import { Ecommerce } from 'ckh-typings';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private stripeService: StripeService) {
    this.logger.log('PaymentService Initialized');
  }

  stripe = this.stripeService.stripe;

  async createPaymentIntent(
    orderPrice: number,
    OrderCurrency: Ecommerce.CurrencyType,
  ) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: orderPrice,
        currency: OrderCurrency.toLowerCase(),
        capture_method: 'manual',
        setup_future_usage: 'off_session',
      });

      return paymentIntent;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to complete payment due to',
        error.message,
      );
    }
  }

  async capturePayment(
    paymentIntendId: string,
    metadata: Record<string, string>,
  ) {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntendId);

      if (!paymentIntent) {
        throw new BadRequestException(
          'The payment does not exist, unable to capture it',
        );
      }

      const paymentConfirmed = await this.stripe.paymentIntents.capture(
        paymentIntendId,
        { metadata },
      );

      if (paymentConfirmed.status != 'succeeded') {
        throw new PaymentStatusException('The payment cannot be captured');
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof PaymentStatusException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Internal Error - The payment cannot be captured',
      );
    }
  }
}
