import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus, Customer } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private repo: Repository<Order>) {}

  getAll() {
    return this.repo.find();
  }

  getOrderByStatus(status: OrderStatus) {
    return this.repo.find({ where: { orderStatus: status } });
  }

  getOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOne({ where: { id } });
  }

  createOne(items: OrderItem[], customer: Customer) {
    const { personalInformation, notes, shippingAddress, billingAddress } =
      customer;
    const { firstName, middleName, lastName, email, phone } =
      personalInformation;

    const {
      address: bilAdd,
      address2nd: billAdd2nd,
      city: billCity,
      zipCode: billZip,
      country: billCountry,
    } = billingAddress;

    const { address, address2nd, city, zipCode, country } = shippingAddress;

    const order = this.repo.create({
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

    for (const { product, quantity } of items) {
      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = quantity;
      orderItems.push(orderItem);
    }

    order.orderItems = orderItems;

    this.repo.save(order);
  }
}
