import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ReadStream } from 'fs';

describe.skip('ImageService', () => {
  let imageService: ImageService;
  let fileSystemMock: any;

  beforeEach(async () => {
    fileSystemMock = {
      existsSync: jest.fn(),
      createReadStream: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        { provide: 'FileSystem', useValue: fileSystemMock },
      ],
    }).compile();

    imageService = module.get<ImageService>(ImageService);
  });

  test('should be defined', () => {
    expect(imageService).toBeDefined();
  });

  describe('validateFileName', () => {
    test('should throw BadRequestException when no file name is provided', () => {
      expect(() => imageService.validateFileName('')).toThrowError(
        BadRequestException,
      );
    });
    test('should throw BadRequestException when file name has an invalid format', () => {
      expect(() =>
        imageService.validateFileName('invalid-name.jpg'),
      ).toThrowError(BadRequestException);
    });

    test('should return the name when it is valid', () => {
      const validName = '72943496-7458-4234-9cb0-e4aeb7c8db41.jpeg';
      const result = imageService.validateFileName(validName);
      expect(result).toEqual(validName);
    });
  });

  describe.skip('getImageFilePath', () => {
    test('should return the correct file path', () => {
      const name = '72943496-7458-4234-9cb0-e4aeb7c8db41.jpeg';
      const result = imageService.getImageFilePath(name);
      expect(result).toContain('uploads');
      expect(result).toContain(name);
    });
  });

  describe.skip('getImageStream', () => {
    test('should throw NotFoundException when image file does not exist', () => {
      const filePath = 'path/to/nonexistent.jpeg';
      fileSystemMock.existsSync = jest.fn().mockReturnValue(false);

      expect(() => imageService.getImageStream(filePath)).toThrowError(
        NotFoundException,
      );
    });

    test('should return a readable stream when image file exists', () => {
      const filePath = './test/72943496-7458-4234-9cb0-e4aeb7c8db41.jpeg';
      const streamMock = {} as any;
      fileSystemMock.existsSync = jest.fn().mockReturnValue(true);
      fileSystemMock.createReadStream = jest.fn().mockReturnValue(streamMock);
      const result = imageService.getImageStream(filePath);
      expect(result).toBeInstanceOf(ReadStream);
    });
  });
});
