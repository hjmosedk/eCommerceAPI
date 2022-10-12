import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
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

  @Get(':id')
  @ApiOperation({
    description: 'This will get one product from the database, based on the ID',
  })
  async getOne(@Param('id') id: string) {
    const product = await this.productsService.getOne(parseInt(id));

    if (!product) {
      throw new NotFoundException('Product not found, or does not exists');
    }
    return product;
  }
}
