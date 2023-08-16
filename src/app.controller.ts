import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('HealthCheck')
@Controller()
export class AppController {
  constructor() {}

  @Get()
  healthService(@Res() response: Response) {
    return response
      .status(HttpStatus.OK)
      .json({ message: 'All OK!', status: response.statusCode });
  }
}
