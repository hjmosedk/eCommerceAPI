import { Controller, Post, Body } from '@nestjs/common';
import { OrderPriceDTO } from './dtos/orderPayment.dto';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment Endpoints')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @ApiOperation({
    description: 'This is function returns a payment clientSecret',
  })
  async paymentIntent(@Body() body: OrderPriceDTO) {
    const { orderPrice, orderCurrency } = body;
    const clientSecret = await this.paymentService.createPaymentIntent(
      orderPrice,
      orderCurrency,
    );
    return { clientSecret };
  }
}
