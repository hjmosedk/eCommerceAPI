import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';
import { ImagesController } from '../../../src/files/images/images.controller';
import { ImageService } from '../../../src/files/images/image.service';
import { Readable } from 'stream';
import { ReadStream } from 'fs';

describe('ImagesController', () => {
  let imagesController: ImagesController;
  let imageService: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [ImageService],
    }).compile();

    imagesController = module.get<ImagesController>(ImagesController);
    imageService = module.get<ImageService>(ImageService);
  });

  describe('getImage', () => {
    test('should return a StreamableFile with correct headers', () => {
      // Arrange
      const res: Partial<Response> = {
        set: jest.fn(),
      };
      const name = 'example.jpg';
      const mockImageStream = new Readable();
      mockImageStream._read = () => {};
      mockImageStream.push('mocked-image-data');
      mockImageStream.push(null);

      jest
        .spyOn(imageService, 'getImageFilePath')
        .mockReturnValue('example.jpg');
      jest
        .spyOn(imageService, 'getImageStream')
        .mockReturnValue(mockImageStream as ReadStream);

      // Act
      const result = imagesController.getImage(res as Response, name);

      // Assert
      expect(result).toBeInstanceOf(StreamableFile);
      expect(res.set).toHaveBeenCalledWith({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `inline; filename=${name}`,
      });
    });

    // Add more tests to cover error cases (e.g., file not found, invalid filename)
  });

  describe('uploadFile', () => {
    test('should return the uploaded image filename', () => {
      // Arrange
      const mockImage: any = {
        filename: 'example.jpg',
      };

      // Act
      const result = imagesController.uploadFile(mockImage);

      // Assert
      expect(result).toEqual({ name: 'example.jpg' });
    });

    // Add more tests to cover different scenarios of uploading files
  });
});
