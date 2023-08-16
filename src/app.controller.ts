/* istanbul ignore file */
//* This file is ignored in testing as the logic in this file is very simple, and will only be used for CI/CD purposed
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
