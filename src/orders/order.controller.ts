import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { NewOrderDto } from './dtos/new-order.dto';

@ApiTags('Orders endpoints')
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @ApiOperation({
    description: 'This endpoint will return all orders in the system',
  })
  async getAll() {
    const orders = await this.orderService.getAll();

    if (orders.length < 1) {
      throw new NotFoundException('There is no orders in the system');
    }

    return orders;
  }

  @Post()
  @ApiOperation({
    description: 'This endpoint will create a order, and return said order',
  })
  async createNewOrder(@Body() body: NewOrderDto) {
    const newOrder = await this.orderService.createOne(
      body.items,
      body.customer,
    );
    return newOrder;
  }

  @Get('/:id')
  @ApiOperation({
    description:
      'This endpoint will return one order correspondent to the id, and it will include all products',
  })
  async findOne(@Param('id') id: string) {
    const order = await this.orderService.getOne(parseInt(id));

    if (!order) {
      throw new NotFoundException('Order not found, or does not exists');
    }

    return order;
  }
}
