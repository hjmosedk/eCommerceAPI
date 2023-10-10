import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus, Customer } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { ProductsService } from 'src/products/products.service';
import { OrderItemsListDto } from './dtos/order-items-list.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    private productService: ProductsService,
  ) {}

  getAll() {
    return this.orderRepo.find();
  }

  getOrderByStatus(status: OrderStatus) {
    return this.orderRepo.find({ where: { orderStatus: status } });
  }

  getOne(id: number) {
    if (!id) {
      return null;
    }

    return this.orderRepo.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  async createOne(items: OrderItemsListDto[], customer: Customer) {
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
    console.log('This is the order items: ', order.orderItems);
    const { id } = await this.orderRepo.save(order);

    return this.getOne(id);
  }

  async changeStatus(orderId: number, newStatus: OrderStatus) {
    const order = await this.getOne(orderId);
    order.orderStatus = newStatus;
    this.orderRepo.save(order);
  }
}
