/* istanbul ignore file */
//* File have been ignore, but function is testing in the test products-controller.spec.ts under the test 'Patch function of the controller is working'
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class UniqueConstraintFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const { message } = exception;

    if (message.includes('duplicate key')) {
      response.status(409).json({
        status: 409,
        message: 'The sku used is already in use, must be unique',
      });
    } else {
      response.status(500).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }
}
