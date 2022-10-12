import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
@ApiTags('e-commerce')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    description:
      'This will get all products from the database - They are not sorted, and any sorting must be done on client side, this also includes items not in stock',
  })
  getAll() {
    return this.productsService.getAll();
  }
}
