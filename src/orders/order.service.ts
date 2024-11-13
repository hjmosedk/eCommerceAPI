import { PaymentService } from './../payment/payment.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { ProductsService } from '../products/products.service';
import typeGuards from './typeGuards/type.guards';
import { NewOrderDto } from './dtos/new-order.dto';
import { Ecommerce } from 'ckh-typings';
import * as Dinero from 'dinero.js';
import { MessageService } from 'src/message/message.service';
import { emailTemplateTypes } from 'src/message/entities/templates.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    private productService: ProductsService,
    private dataSource: DataSource,
    private paymentService: PaymentService,
    private messageService: MessageService,
  ) {}

  private getOrderAndProductInformation() {
    return this.orderRepo
      .createQueryBuilder('order')
      .leftJoin('order.orderItems', 'orderItem')
      .leftJoin('orderItem.product', 'product')
      .select([
        'order',
        'orderItem',
        'product.name',
        'product.sku',
        'product.image',
      ]);
  }

  async getAll(): Promise<Order[]> {
    const orders = await this.getOrderAndProductInformation().getMany();

    if (!orders) {
      return null;
    }

    return orders;
  }

  async getOrderByStatus(status: Ecommerce.OrderStatus): Promise<Order[]> {
    //const submittedStatus = status.toUpperCase();

    if (!typeGuards.isOrderStatus(status)) {
      throw new BadRequestException('Status it not a valid value');
    }

    // * To ensure best practice both in postgres and typescript
    //const postgresqlStatus = status.toLowerCase();
    const orders = await this.getOrderAndProductInformation()
      .where('order.orderStatus = :status', { status: status })
      .getMany();
    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders in system');
    }
    return orders;
  }

  async getOne(id: number): Promise<Order> {
    if (!id) {
      throw new BadRequestException('Id is missing');
    }
    const order = await this.getOrderAndProductInformation()
      .where('order.id = :id', { id: id })
      .getOne();

    if (!order) {
      throw new NotFoundException('No product found with the ID');
    }

    return order;
  }

  async createOne(newOrder: NewOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    const {
      customer,
      orderItems: cartItems,
      orderNotes,
      orderCurrency,
      paymentStatus,
      paymentId,
    } = newOrder;

    if (!cartItems || !customer || !paymentStatus) {
      throw new BadRequestException(
        'Items, customer or paymentStatus is missing',
      );
    }

    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
    } catch (error) {
      throw new Error(`Filed to start transaction: ${error.message}`);
    }

    try {
      const order = this.orderRepo.create({
        customer,
        orderNotes,
        orderCurrency,
      });

      const orderItems: OrderItem[] = [];
      let orderTotalPrice = Dinero({ amount: 0, currency: orderCurrency });

      for (const { id, salesQuantity, price } of cartItems) {
        if (salesQuantity <= 0 || price <= 0) {
          await queryRunner.rollbackTransaction();
          throw new BadRequestException(
            `salesQuantity: ${salesQuantity} and/ or price: ${price} must be equal or greater then 1`,
          );
        }

        const orderProduct = await this.productService.getOne(id);
        if (!orderProduct) {
          await queryRunner.rollbackTransaction();
          throw new NotFoundException(`Product with ID ${id} not found.`);
        }

        const itemsInOrder = new OrderItem();
        itemsInOrder.productId = id;
        itemsInOrder.salesQuantity = salesQuantity;
        itemsInOrder.price = price;
        orderItems.push(itemsInOrder);
        await this.orderItemRepo.save(itemsInOrder);

        const itemTotal = Dinero({
          amount: price,
          currency: orderCurrency,
        }).multiply(salesQuantity);
        orderTotalPrice = orderTotalPrice.add(itemTotal);
      }

      order.orderItems = orderItems;
      order.orderTotalPrice = orderTotalPrice.getAmount();
      order.paymentStatus = paymentStatus;
      order.paymentId = paymentId;

      const savedOrder = await this.orderRepo.save(order);

      // Commit the transaction
      await queryRunner.commitTransaction();

      await this.messageService.sendMail(
        customer.personalInformation.email,
        emailTemplateTypes.newOrder,
        {
          firstName: customer.personalInformation.firstName,
          lastName: customer.personalInformation.lastName,
          orderNumber: order.id.toString(),
        },
      );

      return await this.getOne(savedOrder.id);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error(`Failed to create order, ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async changeStatus(
    orderId: number,
    newStatus: Ecommerce.OrderStatus,
  ): Promise<Order> {
    if (!orderId || !newStatus) {
      throw new BadRequestException('Id or status missing');
    }

    if (!typeGuards.isOrderStatus(newStatus)) {
      throw new BadRequestException('New Status is not accepted');
    }

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found in system');
    }

    await this.handleStatusChange(order, newStatus);

    const newOrderStatus = newStatus.toUpperCase();
    order.orderStatus = newOrderStatus as Ecommerce.OrderStatus;
    if (newOrderStatus === Ecommerce.OrderStatus.CONFIRMED) {
      order.paymentId = 'orderPayed';
      order.paymentMethodId = 'orderPayed';
      order.paymentStatus = 'succeeded';
    }
    const updatedOrder = await this.orderRepo.save(order);

    return updatedOrder;
  }

  async confirmOrder(order: Order) {
    const { personalInformation } = order.customer;
    const { email, firstName, lastName } = personalInformation;

    try {
      await this.paymentService.capturePayment(order.paymentId, {
        orderId: order.id.toString(),
      });
      await this.messageService.sendMail(
        email,
        emailTemplateTypes.orderConfirmed,
        { firstName, lastName, orderNumber: order.id.toString() },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'The order cannot be confirmed! - Please try again',
      );
    }
  }

  async shipOrder(order: Order) {
    const { personalInformation } = order.customer;
    const { email, firstName, lastName } = personalInformation;

    try {
      await this.messageService.sendMail(
        email,
        emailTemplateTypes.orderShipped,
        { firstName, lastName, orderNumber: order.id.toString() },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'The order cannot be shipped! - Please try again',
      );
    }
  }

  async handleStatusChange(order: Order, newStatus: Ecommerce.OrderStatus) {
    const statusHandlers = {
      [Ecommerce.OrderStatus.CONFIRMED]: this.confirmOrder,
      [Ecommerce.OrderStatus.SHIPPED]: this.shipOrder,
    };

    const handler = statusHandlers[newStatus];
    if (handler) {
      await handler.call(this, order);
    } else {
      throw new BadRequestException('Unsupported Order Status');
    }
  }
}
