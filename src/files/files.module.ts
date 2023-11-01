/* istanbul ignore file */
//* File ignored in testing, as this is a configuration file, and not a logic file - No logic to test
import { Module } from '@nestjs/common';
import { ImageService } from './images/image.service';
import { ImagesController } from './images/images.controller';

@Module({
  controllers: [ImagesController],
  providers: [ImageService],
  exports: [ImageService],
})
export class FilesModule {}
