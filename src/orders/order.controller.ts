import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';

@ApiTags('Orders endpoints')
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Get()
  async getAll() {
    const orders = await this.orderService.getAll();

    if (orders.length < 1) {
      throw new NotFoundException('There is no orders in the system');
    }

    return orders;
  }
}
