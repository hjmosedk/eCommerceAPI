/* istanbul ignore file */
// * File ignored in testing, as this is a configuration file, and not a logic file - No logic to test
import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { APP_PIPE } from '@nestjs/core';
import { FilesModule } from './files/files.module';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/orderItem.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('DATABASE_HOST'),
          port: config.get<number>('DATABASE_PORT'),
          username: config.get<string>('DATABASE_USERNAME'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
          entities: [Product, Order, OrderItem],
          synchronize: true,
          dropSchema: process.env.NODE_ENV === 'test' ? true : false,
        };
      },
    }),
    ConfigModule.forRoot({
      envFilePath: `env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    ProductsModule,
    FilesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
