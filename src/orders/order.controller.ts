import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Body,
  BadRequestException,
  Query,
  Patch,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { NewOrderDto } from './dtos/new-order.dto';

import { Ecommerce } from 'ckh-typings';

@ApiTags('Orders endpoints')
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @ApiOperation({
    description:
      'This will return all orders in the system, with relevant pagination',
  })
  async getAllOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
  ) {
    const [orders, totalCount] = await this.orderService.getAll(page, limit);
    return {
      orders,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  @Get('status/:status')
  @ApiOperation({
    description:
      'This endpoint will return all orders in the system, based on the status in the order',
  })
  async getAll(
    @Param('status') status: Ecommerce.OrderStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
  ) {
    const [orders, totalCount] = await this.orderService.getOrderByStatus(
      status,
      page,
      limit,
    );
    return {
      orders,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  @Post()
  @ApiOperation({
    description: 'This endpoint will create a order, and return said order',
  })
  async createNewOrder(@Body() body: NewOrderDto) {
    const newOrder = await this.orderService.createOne(body);
    return newOrder;
  }

  @Get('/:id')
  @ApiOperation({
    description:
      'This endpoint will return one order correspondent to the id, and it will include all products',
  })
  async findOne(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Id is missing');
    }

    const order = await this.orderService.getOne(parseInt(id));

    if (!order) {
      throw new NotFoundException('Order not found, or does not exists');
    }

    const { paymentId, paymentStatus, ...orderWithoutPaymentDetails } = order;

    return orderWithoutPaymentDetails;
  }

  @Patch('/:id')
  @ApiOperation({
    description:
      'This endpoint will allow the user to change the status of the orders',
  })
  async updateStatus(
    @Param('id') id: string,
    @Query('status') status: Ecommerce.OrderStatus,
  ) {
    if (!status || !id) {
      throw new BadRequestException(
        'Id or new status is missing from the request',
      );
    }

    const updatedOrder = await this.orderService.changeStatus(
      parseInt(id),
      status,
    );

    if (!updatedOrder) {
      throw new InternalServerErrorException('Unknown error!');
    }

    return updatedOrder;
  }
}
