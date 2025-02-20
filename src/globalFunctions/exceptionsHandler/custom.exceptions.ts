import { InternalServerErrorException } from '@nestjs/common';

export class PaymentStatusException extends InternalServerErrorException {
  constructor(message: string) {
    super(message);
  }
}
