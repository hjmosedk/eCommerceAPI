/* istanbul ignore file */
// * File ignored in testing, as this is a configuration file, and not a logic file - No logic to test
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UniqueConstraintFilter } from './unique-constraint.filter';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), PaymentModule],
  providers: [
    ProductsService,
    { provide: APP_FILTER, useClass: UniqueConstraintFilter },
  ],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
