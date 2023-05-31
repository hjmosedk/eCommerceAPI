import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';

@Injectable()
export class ImageService {
  validateFileName = (name: string): string => {
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

  getImageFilePath(name: string): string {
    const validatedName = this.validateFileName(name);
    return join(process.cwd(), './uploads', validatedName);
  }

  getImageStream(filePath: string) {
    if (!existsSync(filePath)) {
      throw new NotFoundException('No Image was stored on the server');
    }

    return createReadStream(filePath);
  }
}
