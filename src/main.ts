import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrapSwagger } from './common/swagger/bootstrap-swagger';
import { useGlobalPipes } from './common/useGlobalPipes';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { bootstrapFastifyCors } from './common/fastify/cors.fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  bootstrapSwagger(app);
  useGlobalPipes(app);
  await bootstrapFastifyCors(app);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
