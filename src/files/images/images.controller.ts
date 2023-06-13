import {
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { ImageService } from './image.service';
import { randomUUID } from 'crypto';

@Controller('images')
export class ImagesController {
  constructor(private imageService: ImageService) {}

  @Get(':name')
  @ApiOperation({
    description:
      'This controller will get capture the images from the frontend and upload it to the server, make it possibly for users to add it to the frontend',
  })
  getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('name') name: string,
  ): StreamableFile {
    const imageFilePath = this.imageService.getImageFilePath(name);
    // file deepcode ignore PT: Check have been made in service to ensure only UUIDs is acceptable as file names.
    const imageStream = this.imageService.getImageStream(imageFilePath);

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `inline; filename=${name}`,
    });
    return new StreamableFile(imageStream);
  }

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
}
