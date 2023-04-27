import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { APP, PORT, STATIC_EXCEL, STATIC_URL } from '../config/app-config';
import * as dotenv from 'dotenv';
import cors from 'cors';
import fastifyMultipart from '@fastify/multipart';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  app.setGlobalPrefix('/api');
  // app.use(`/${STATIC_URL}`, express.static('public/files'));
  // app.use(`/${STATIC_EXCEL}`, express.static('public/excel'));
  app.use(
    cors({
      origin: '*',
      exposedHeaders: ['Content-Range'],
    }),
  );
  app.register(fastifyMultipart);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle(APP.title)
    .setDescription(APP.description)
    .setVersion(APP.version)
    // .addBearerAuth({ in: 'header', type: 'http' })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('cat-shop-api-docs', app, document);

  await app.listen(PORT);
}
bootstrap();
