import { Injectable, Inject, Logger } from '@nestjs/common';

import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private Stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(@Inject('STRIPE_KEY') private readonly apiKey: string) {
    this.Stripe = new Stripe(this.apiKey);
    this.logger.log('StripeService Initialized');
  }

  get stripe(): Stripe {
    return this.Stripe;
  }
}
