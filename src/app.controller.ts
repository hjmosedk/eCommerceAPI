/* istanbul ignore file */
//* This file is ignored in testing as the logic in this file is very simple, and will only be used for CI/CD purposed
import { Controller, Get, HttpStatus, Res, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProductsService } from './products/products.service';
import { testProducts } from '../tests/testObjects';

@ApiTags('General EndPoints')
@Controller()
export class AppController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/healthCheck')
  healthService(@Res() response: Response) {
    return response
      .status(HttpStatus.OK)
      .json({ message: 'All OK!', status: response.statusCode });
  }

  @Post('/resetDatabase')
  @ApiOperation({
    description:
      "This endpoint does not work in production, and have been designed for test. It is hardcoded to just return if the system is in 'test' -> anything but process.env.NODE_ENV = 'test', will have no effect on this endpoint",
  })
  async resetDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      return;
    }

    await this.productsService.clearDatabase();
    return { message: 'Database cleared successfully' };
  }

  @Post('/seedDatabase')
  @ApiOperation({
    description:
      "This endpoint does not work in production, and have been designed for test. It is hardcoded to just return if the system is in 'test' -> anything but process.env.NODE_ENV = 'test', will have no effect on this endpoint",
  })
  async seedDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      return;
    }

    await this.productsService.createMany(testProducts);

    return {
      message: 'Database seeded successfully',
      count: testProducts.length,
      seededSkus: testProducts.map((product) => product.sku),
    };
  }
}
