import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const allowlist = ['http://192.168.1.135:3000', 'http://192.168.1.135:4200'];
  const corsOptionsDelegate = function (req: any, callback: any) {
    let corsOptions: any;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
  };

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('eCommerce App')
    .setDescription(
      'This is the API for the eCommerce app made by Christian Kubel Højmose',
    )
    .setVersion('0.1.0')
    .addTag('e-commerce')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors(corsOptionsDelegate);
  await app.listen(3000);
}
bootstrap();
