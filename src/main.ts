import helmet from 'helmet';
import * as morgan from 'morgan';
import { json } from 'express';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@Shared/http-exception';
import { TransformInterceptor } from '@Shared/http-interception';
import { basicMiddleware } from '@Shared/middleware/basic.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix(config.get<string>('app.prefixApi'));
  const options = new DocumentBuilder()
    .setTitle('API PRODUCT')
    .setDescription('THE DEMO API PRODUCT')
    .setVersion('1.0')
    .addBearerAuth({ in: 'headers', type: 'http' })
    .build();
  app.use(
    '/api/docs',
    basicMiddleware(
      config.get('app.basicUsername'),
      config.get('app.basicPassword'),
    ),
  );
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.use(helmet());
  app.use(morgan('tiny'));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: config.get<boolean>('app.isProduction'),
      transform: true,
    }),
  );
  app.set('trust proxy', 1);
  app.use(json({ limit: '15mb' }));
  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      return callback(null, true);
    },
    methods: 'GET,PUT,PATCH,POST,DELETE',
  });

  await app.listen(config.get<number>('app.port'));
  console.log(`Server running on ${await app.getUrl()}`);
}
bootstrap();
