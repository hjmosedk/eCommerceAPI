/* istanbul ignore file */
// * File ignored in testing, as this is a configuration file, and not a logic file - No logic to test
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { GlobalExceptionFilter } from './globalFunctions/exceptionsHandler/GlobalExceptionFilter';

async function bootstrap() {
  const allowlist = process.env.ALLOWLIST?.split(',') || [];
  const corsOptionsDelegate = function (req: any, callback: any) {
    let corsOptions: any;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
  };

  const httpsOptions = {
    key: readFileSync('./src/cert/192.168.1.135-key.pem'),
    cert: readFileSync('./src/cert/192.168.1.135.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
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
