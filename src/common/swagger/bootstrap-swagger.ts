import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function bootstrapSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Ambeaver API')
    .addBearerAuth()
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
