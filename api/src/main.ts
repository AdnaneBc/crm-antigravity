import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Class serializer (excludes @Exclude() fields like passwordHash)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('PharmaFlow CRM API')
    .setDescription('REST API for pharmaceutical CRM platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 PharmaFlow API running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs:              http://localhost:${port}/api/docs`);
}
bootstrap();
