import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrapSwagger } from './common/swagger/bootstrap-swagger';
import { useGlobalPipes } from './common/useGlobalPipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  bootstrapSwagger(app);
  useGlobalPipes(app);
  await app.listen(3000);
}
bootstrap();
