import { Controller, Post, Body } from '@nestjs/common';
import { OrderPriceDTO } from './dtos/orderPayment.dto';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as Dinero from 'dinero.js';

@ApiTags('Payment Endpoints')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @ApiOperation({
    description: 'This is function returns a payment clientSecret',
  })
  async paymentIntent(@Body() body: OrderPriceDTO) {
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

    const { id, client_secret } = await this.paymentService.createPaymentIntent(
      orderPrice.getAmount(),
      orderCurrency,
    );

    return { id, clientSecret: client_secret };
  }
}
