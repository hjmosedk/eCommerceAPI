import { IsCurrency } from './../orders/typeGuards/custom.validators';
import { Order } from './../orders/entities/order.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Ecommerce } from 'ckh-typings';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const stripeKey = this.configService.get<string>('STRIPE_KEY');
    if (!stripeKey) {
      throw new InternalServerErrorException('Stripe key is not defined');
    }
    this.stripe = new Stripe(stripeKey);
  }

  async createPaymentIntent(
    orderPrice: number,
    OrderCurrency: Ecommerce.CurrencyType,
  ) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: orderPrice,
      currency: OrderCurrency.toLowerCase(),
      capture_method: 'manual',
      setup_future_usage: 'off_session',
    });

    return paymentIntent;
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
        throw new InternalServerErrorException(
          'The payment cannot be captured',
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Internal Error - The payment cannot be captured',
      );
    }
  }
}
