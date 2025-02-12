import { DynamicModule, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';

@Module({})
export class PaymentModule {
  static forRootAsync(): DynamicModule {
    return {
      module: PaymentModule,
      controllers: [PaymentController],
      imports: [ConfigModule.forRoot()],
      providers: [
        PaymentService,
        {
          provide: 'STRIPE_KEY',
          useFactory: async (configService: ConfigService) =>
            configService.get<string>('STRIPE_KEY'),
          inject: [ConfigService],
        },
        StripeService,
      ],
      exports: [PaymentService, 'STRIPE_KEY', StripeService],
    };
  }
}
