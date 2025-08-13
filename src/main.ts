/* istanbul ignore file */
// * File ignored in testing, as this is a configuration file, and not a logic file - No logic to test
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { GlobalExceptionFilter } from './globalFunctions/exceptionsHandler/GlobalExceptionFilter';
import { checkPrimeSync } from 'crypto';

async function bootstrap() {
  const allowlist = process.env.ALLOWLIST?.split(',') || [];
  const corsOptionsDelegate = function (req: any, callback: any) {
    const origin = req.header('Origin');
    const corsOptions = allowlist.includes(origin)
      ? {
          origin: true,
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
          allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
          credentials: true,
        }
      : { origin: false };

    callback(null, corsOptions);
  };
  const httpsOptions = {
    key: readFileSync(process.env.HTTPS_KEY),
    cert: readFileSync(process.env.HTTPS_CERT),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.useGlobalFilters(new GlobalExceptionFilter());

  const packageJsonPath = resolve(__dirname, '../..', 'package.json');
  const packageJsonContent = readFileSync(packageJsonPath, 'utf8');
  const { version, description, name } = JSON.parse(packageJsonContent);

  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors(corsOptionsDelegate);
  await app.listen(3000);
}
bootstrap();
