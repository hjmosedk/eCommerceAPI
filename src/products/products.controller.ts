import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProductDto } from './dtos/create-product.dto';
@ApiTags('e-commerce')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    description:
      'This will get all products from the database - They are not sorted, and any sorting must be done on client side, this also includes items not in stock',
  })
  async getAll() {
    const products = await this.productsService.getAll();

    if (products.length < 1) {
      throw new NotFoundException('There is no products in the database');
    }

    return products;
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

  @Post()
  @ApiOperation({
    description:
      'This wil create a new product and return a copy of the newly created product',
  })
  async createOne(@Body() body: CreateProductDto) {
    const newProduct = await this.productsService.createOne(body);
    return newProduct;
  }
}
