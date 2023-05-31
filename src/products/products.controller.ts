import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

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

  /*
  @Get('file/:name')
  getFile(
    @Res({ passthrough: true }) res: Response,
    @Param('name') name: string,
  ): StreamableFile {
    const validateName = (name: string) => {
      const file = name.split('.')[0];
      const validFileName = (name: string): boolean => {
        const uuidPattern =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        return uuidPattern.test(name);
      };

      if (!file) {
        throw new BadRequestException('A file name must be provide');
      }
      if (!validFileName(file)) {
        throw new BadRequestException('The file does not have a valid format');
      }

      return name;
    };

    // file deepcode ignore PT: The problem have been migrated, only valid UUDIs, can be put into the system - any UUID not in the system will throw an error
    const imageFilePath = join(process.cwd(), `./uploads`, validateName(name));

    if (!existsSync(imageFilePath)) {
      throw new NotFoundException('No Image where stored on the server');
    }

    const image = createReadStream(imageFilePath);

    res.set({
      'Content-Type': 'application/jpeg',
      'Content-Disposition': `attachment; filename=${name}`,
    });
    return new StreamableFile(image);
  }
*/
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

  /*
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          const mimeType = file.mimetype.split('/')[1];
          const fileID = randomUUID();
          const fileName = `${fileID}.${mimeType}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() image: Express.Multer.File) {
    return { name: image.filename };
  }
*/

  @Patch(':id')
  @ApiOperation({
    description:
      'This will allow for the update of a product - some data cannot be updated, and will not be accepted by the server - Refer to the DTO',
  })
  updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.updateProduct(parseInt(id), body);
  }
}
