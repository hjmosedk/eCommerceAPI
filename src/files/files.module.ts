import { Module } from '@nestjs/common';
import { ImageService } from './images/image.service';
import { ImagesController } from './images/images.controller';

@Module({
  controllers: [ImagesController],
  providers: [ImageService],
})
export class FilesModule {}
