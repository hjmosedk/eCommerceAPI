/* istanbul ignore file */
// * File ignored in testing, as this is a configuration file, and not a logic file - No logic to test
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductsModule } from '../products/products.module';
import { OrderItem } from './entities/orderItem.entity';
import { PaymentModule } from '../payment/payment.module';
import { PaymentService } from '../payment/payment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
    PaymentModule.forRootAsync(),
    ConfigModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, PaymentService],
  exports: [OrderService],
})
export class OrdersModule {}
