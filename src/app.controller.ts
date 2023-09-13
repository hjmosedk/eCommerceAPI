/* istanbul ignore file */
//* This file is ignored in testing as the logic in this file is very simple, and will only be used for CI/CD purposed
import { Controller, Get, HttpStatus, Res, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProductsService } from './products/products.service';

@ApiTags('General EndPoints')
@Controller()
export class AppController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/healthCheck')
  healthService(@Res() response: Response) {
    console.log(process.env.NODE_ENV);
    return response
      .status(HttpStatus.OK)
      .json({ message: 'All OK!', status: response.statusCode });
  }

  @Post('/resetDatabase')
  async resetDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      return;
    }

    await this.productsService.clearDatabase();
    return { message: 'Database cleared successfully' };
  }
}
