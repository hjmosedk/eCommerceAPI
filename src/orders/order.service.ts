import {
  BadRequestException,
  Injectable,
  //InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository /*UpdateResult*/ } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { ProductsService } from '../products/products.service';
import typeGuards from './typeGuards/type.guards';
import { NewOrderDto } from './dtos/new-order.dto';
import { Ecommerce } from 'ckh-typings';
import * as Dinero from 'dinero.js';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    private productService: ProductsService,
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
    const {
      customer,
      orderItems: cartItems,
      orderNotes,
      orderCurrency,
    } = newOrder;

    if (!cartItems || !customer) {
      throw new BadRequestException('Items or customer missing');
    }

    const order = this.orderRepo.create({
      customer,
      orderNotes,
      orderCurrency,
    });

    const orderItems: OrderItem[] = [];
    let orderTotalPrice = Dinero({ amount: 0, currency: orderCurrency });

    for (const { id, salesQuantity, price } of cartItems) {
      try {
        const orderProduct = await this.productService.getOne(id);
        if (!orderProduct) {
          throw new NotFoundException('Product is not in store');
        }

        const itemsInOrder = new OrderItem();
        itemsInOrder.productId = id;
        itemsInOrder.salesQuantity = salesQuantity;
        itemsInOrder.price = price;
        orderItems.push(itemsInOrder);
        this.orderItemRepo.save(itemsInOrder);

        const itemTotal = Dinero({
          amount: price,
          currency: orderCurrency,
        }).multiply(salesQuantity);
        orderTotalPrice = orderTotalPrice.add(itemTotal);
      } catch (error) {
        if (error.status === 404) {
          throw error;
        }
        throw new Error(`Not able to create order - Error CKH001`);
      }
    }

    order.orderItems = orderItems;
    order.orderTotalPrice = parseInt(orderTotalPrice.toFormat());

    const { id } = await this.orderRepo.save(order);
    return await this.getOne(id);
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
    const newOrderStatus = newStatus.toUpperCase();
    order.orderStatus = newOrderStatus as Ecommerce.OrderStatus;
    //order.updateLastChange();
    const updatedOrder = await this.orderRepo.save(order);

    return updatedOrder;
    /*
    const updatedOrder: UpdateResult = await this.orderRepo.update(
      { id: orderId },
      { orderStatus: newOrderStatus },
    );

    if (updatedOrder.affected === 1) {
      return order;
    } else {
      throw new InternalServerErrorException('Failed to update order status');
    }*/
  }
}
