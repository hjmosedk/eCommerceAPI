import { IsCurrency } from './../orders/typeGuards/custom.validators';
import { Order } from './../orders/entities/order.entity';
import { Injectable } from '@nestjs/common';
import { Ecommerce } from 'ckh-typings';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_KEY);
  }

  async createPaymentIntent(
    orderPrice: number,
    OrderCurrency: Ecommerce.CurrencyType,
  ) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: orderPrice,
      currency: OrderCurrency.toLowerCase(),
      capture_method: 'manual',
    });
    return paymentIntent;
  }
}
