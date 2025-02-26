import { Controller, Post, Body } from '@nestjs/common';
import { OrderPaymentDTO } from './dtos/orderPayment.dto';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as Dinero from 'dinero.js';

@ApiTags('Payment Endpoints')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @ApiOperation({
    description: 'This is function returns a payment paymentIntent',
  })
  async paymentIntent(@Body() body: OrderPaymentDTO) {
    const { orderCurrency, orderItems } = body;

    const orderPrice = orderItems.reduce(
      (totalPrice, OrderItem) => {
        const orderItemPrice = Dinero({
          amount: OrderItem.price,
          currency: orderCurrency,
        });
        const orderItemTotalPrice = orderItemPrice.multiply(
          OrderItem.salesQuantity,
        );
        return orderItemTotalPrice.add(totalPrice);
      },
      Dinero({ amount: 0, currency: orderCurrency }),
    );

    return await this.paymentService.createPaymentIntent(
      orderPrice.getAmount(),
      orderCurrency,
    );
  }
}
