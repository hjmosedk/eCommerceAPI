import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus, Customer } from './entities/order.entity';
import { Repository, UpdateResult } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { ProductsService } from '../products/products.service';
import { OrderItemsListDto } from './dtos/order-items-list.dto';
import typeGuards from './typeGuards/type.guards';

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
      throw new NotFoundException('Database does not have any products');
    }

    return orders;
  }

  async getOrderByStatus(status: OrderStatus): Promise<Order[]> {
    if (!typeGuards.isOrderStatus(status)) {
      throw new BadRequestException('Status it not a valid value');
    }

    // * To ensure best practice both in postgres and typescript
    const postgresqlStatus = status.toLowerCase();
    const orders = await this.getOrderAndProductInformation()
      .where('order.orderStatus = :status', { status: postgresqlStatus })
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

  async createOne(
    items: OrderItemsListDto[],
    customer: Customer,
  ): Promise<Order> {
    if (!items || !customer) {
      throw new BadRequestException('Items or customer missing');
    }

    const { personalInformation, shippingAddress, billingAddress, notes } =
      customer;
    const { firstName, lastName, middleName, email, phone } =
      personalInformation;
    const {
      address: bilAdd,
      address2nd: billAdd2nd,
      city: billCity,
      zipCode: billZip,
      country: billCountry,
    } = billingAddress;
    const { address2nd, address, city, country, zipCode } = shippingAddress;

    const order = this.orderRepo.create({
      customerFirstName: firstName,
      customerMiddleName: middleName,
      customerLastName: lastName,
      customerEmail: email,
      customerPhone: phone,
      customerShippingNotes: notes,
      customerBillingAddress: bilAdd,
      customerBilling2ndAddress: billAdd2nd,
      customerBillingCity: billCity,
      customerBillingCountry: billCountry,
      customerBillingZipCode: billZip,
      customerShipping2ndAddress: address2nd,
      customerShippingAddress: address,
      customerShippingCity: city,
      customerShippingCountry: country,
      customerShippingZipCode: zipCode,
    });
    const orderItems: OrderItem[] = [];

    for (const { productId, orderedQuantity, salesPrice } of items) {
      try {
        const orderProduct = await this.productService.getOne(productId);
        if (!orderProduct) {
          throw new NotFoundException('Product is not in store');
        }

        const itemsInOrder = new OrderItem();
        itemsInOrder.productId = productId;
        itemsInOrder.orderedQuantity = orderedQuantity;
        itemsInOrder.salesPrice = salesPrice;
        this.orderItemRepo.save(itemsInOrder);

        orderItems.push(itemsInOrder);
      } catch (error) {
        throw new Error(`Not able to create order - Error CKH001`);
      }
    }

    order.orderItems = orderItems;
    const { id } = await this.orderRepo.save(order);

    return await this.getOne(id);
  }

  async changeStatus(orderId: number, newStatus: OrderStatus): Promise<Order> {
    if (!orderId || !newStatus) {
      throw new BadRequestException('Id or status missing');
    }

    if (!typeGuards.isOrderStatus(newStatus)) {
      throw new BadRequestException('New Status is not accepted');
    }

    const order = await this.getOne(orderId);
    if (!order) {
      throw new NotFoundException('Order not found in system');
    }

    const newOrderStatus = newStatus.toLowerCase();
    order.orderStatus = newOrderStatus;

    const updatedOrder: UpdateResult = await this.orderRepo.update(
      { id: orderId },
      { orderStatus: newOrderStatus },
    );

    if (updatedOrder.affected === 1) {
      return order;
    } else {
      throw new InternalServerErrorException('Failed to update order status');
    }
  }
}
