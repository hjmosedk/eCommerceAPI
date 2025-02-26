import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@ApiTags('Products endpoints')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    description:
      'This will return all product with stock <0 and who are public',
  })
  async getActiveProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
  ) {
    const [activeProducts, totalCount] =
      await this.productsService.getActiveProducts(page, limit);

    if (activeProducts.length < 1) {
      throw new NotFoundException('There is no products in the database');
    }

    return {
      products: activeProducts,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  @Get('/all')
  @ApiOperation({
    description:
      'This will get all products from the database - They are not sorted, and any sorting must be done on client side, this also includes items not in stock, and products who are not public',
  })
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
  ) {
    const [products, totalCount] = await this.productsService.getAll(
      page,
      limit,
    );

    if (products.length < 1) {
      throw new NotFoundException('There is no products in the database');
    }

    return {
      products,
      page,
      limit,
      totalCount,
      totalPage: Math.ceil(totalCount / limit),
    };
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

  @Post(':id')
  @ApiOperation({
    description:
      'This endpoint will change the status of the isPublic property',
  })
  async changeStatus(@Param('id') id: string) {
    const updatedProduct = await this.productsService.updateStatus(
      parseInt(id),
    );

    return updatedProduct;
  }

  @Patch(':id')
  @ApiOperation({
    description:
      'This will allow for the update of a product - some data cannot be updated, and will not be accepted by the server - Refer to the DTO',
  })
  updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.updateProduct(parseInt(id), body);
  }
}
