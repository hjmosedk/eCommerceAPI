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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { ImageService } from './image.service';
import { randomUUID } from 'crypto';

@ApiTags('Images')
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
          /* istanbul ignore next */ //* These will be tested as part of the system
          const mimeType = file.mimetype.split('/')[1];
          /* istanbul ignore next */ //* These will be tested as part of the system
          const fileID = randomUUID();
          /* istanbul ignore next */ //* These will be tested as part of the system
          const fileName = `${fileID}.${mimeType}`;
          /* istanbul ignore next */ //* These will be tested as part of the system
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() image: Express.Multer.File) {
    return { name: image.filename };
  }
}
