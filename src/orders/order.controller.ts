import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
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
import { OrderStatus } from './entities/order.entity';
import typeGuards from './typeGuards/type.guards';

@ApiTags('Orders endpoints')
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @ApiOperation({
    description:
      'This endpoint will return all orders in the system, the query params allows for the API to sort on order status',
  })
  @ApiQuery({ name: 'status', required: false })
  async getAll(@Query('status') status: OrderStatus = null) {
    if (status) {
      if (!typeGuards.isOrderStatus(status)) {
        throw new BadRequestException('Status is not correct');
      }

      const orders = await this.orderService.getOrderByStatus(status);

      return orders;
    } else {
      const orders = await this.orderService.getAll();

      if (orders.length < 1 || !orders) {
        throw new NotFoundException('There is no orders in the system');
      }

      return orders;
    }
  }

  @Post()
  @ApiOperation({
    description: 'This endpoint will create a order, and return said order',
  })
  async createNewOrder(@Body() body: NewOrderDto) {
    console.log(body);

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

    return order;
  }

  @Patch('/:id')
  @ApiOperation({
    description:
      'This endpoint will allow the user to change the status of the orders',
  })
  async updateStatus(
    @Param('id') id: string,
    @Query('status') status: OrderStatus,
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
